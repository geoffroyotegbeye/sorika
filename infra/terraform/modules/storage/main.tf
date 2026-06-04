# ============================================================================
# Module Storage - Bucket S3 pour les Uploads
# ============================================================================
# Ce module crée un bucket S3 pour stocker les fichiers uploadés (images, documents).
#
# Pourquoi S3 ?
# - Scalabilité infinie : pas de limite de stockage
# - Durabilité : 99.999999999% (11 neuf) de durabilité
# - Coût : 5GB gratuit sur Free Tier, très économique au-delà
# - Lifecycle rules : transition automatique vers Glacier pour économies
#
# Alternatives non choisies :
# - Stockage local sur EC2 : Pas scalable, pas durable
# - EFS : Plus cher, surdimensionné pour des uploads simples
#
# Documentation AWS : https://docs.aws.amazon.com/s3/
# ============================================================================

# ----------------------------------------------------------------------------
# Bucket S3
# ----------------------------------------------------------------------------
# Conteneur pour stocker les objets (fichiers)
# ----------------------------------------------------------------------------

resource "aws_s3_bucket" "main" {
  bucket = "${var.project_name}-${var.environment}-uploads"
  # Nom du bucket S3 (doit être unique globalement)
  # Exemple : sorika-dev-uploads
  # Le nom doit être unique dans tous les AWS (pas seulement dans la région)
  # Doit contenir uniquement des lettres minuscules, chiffres et tirets

  tags = {
    Name        = "${var.project_name}-${var.environment}-s3"
    # Exemple : sorika-dev-s3
    Environment = var.environment
    Project     = var.project_name
  }
}

# ----------------------------------------------------------------------------
# Blocage de l'Accès Public
# ----------------------------------------------------------------------------
# Sécurité : Empêche tout accès public au bucket
# IMPORTANT : Pour la sécurité des données, le bucket ne doit pas être public
# ----------------------------------------------------------------------------

resource "aws_s3_bucket_public_access_block" "main" {
  bucket = aws_s3_bucket.main.id
  # Référence au bucket S3 créé ci-dessus

  block_public_acls       = true
  # Bloque les ACLs publiques (Access Control Lists)
  # Empêche les utilisateurs de rendre des objets publics via ACLs

  block_public_policy     = true
  # Bloque les politiques publiques au niveau du bucket
  # Empêche les utilisateurs de créer des politiques bucket publiques

  ignore_public_acls      = true
  # Ignore les ACLs publiques existantes
  # Si un objet a une ACL publique, elle est ignorée

  restrict_public_buckets = true
  # Restreint l'accès public aux buckets
  # Empêche les comptes AWS externes d'accéder publiquement

  # Pourquoi cette configuration ?
  # - Defense in Depth : Plusieurs couches de protection
  # - Sécurité : Empêche les fuites de données accidentelles
  # - Compliance : Respect des meilleures pratiques AWS
}

# ----------------------------------------------------------------------------
# Versioning
# ----------------------------------------------------------------------------
# Conserve plusieurs versions d'un même objet
# Permet de récupérer les versions précédentes des fichiers
# ----------------------------------------------------------------------------

resource "aws_s3_bucket_versioning" "main" {
  bucket = aws_s3_bucket.main.id

  versioning_configuration {
    status = "Enabled"
    # Active le versioning sur le bucket
    # Chaque modification d'un objet crée une nouvelle version
    # Les anciennes versions sont conservées
  }

  # Pourquoi le versioning ?
  # - Récupération : Peut restaurer une version précédente
  # - Protection : Empêche la suppression accidentelle
  # - Audit : Historique des modifications
}

# ----------------------------------------------------------------------------
# Lifecycle Rules
# ----------------------------------------------------------------------------
# Règles de gestion du cycle de vie des objets
# Transition automatique vers Glacier pour économies
# ----------------------------------------------------------------------------

resource "aws_s3_bucket_lifecycle_configuration" "main" {
  bucket = aws_s3_bucket.main.id

  rule {
    id     = "archive-old-files"
    # Identifiant unique de la règle
    status = "Enabled"
    # Règle active

    # Transition vers Glacier pour les objets actuels
    transition {
      days          = 30
      # Après 30 jours, transitionner vers Glacier
      storage_class = "GLACIER"
      # Glacier = stockage à faible coût pour les données d'archive
      # Coût : ~$0.004/GB vs ~$0.023/GB pour S3 standard
    }

    # Transition vers Glacier pour les versions non actuelles
    noncurrent_version_transition {
      noncurrent_days = 30
      # Après 30 jours, transitionner les versions non actuelles
      storage_class    = "GLACIER"
      # Les anciennes versions sont déplacées vers Glacier
    }
  }

  # Pourquoi cette règle ?
  # - Économies : Glacier est ~6x moins cher que S3 standard
  # - Automatique : Pas besoin de déplacer les fichiers manuellement
  # - Adapté : Les anciens uploads sont rarement accédés après 30 jours
}

# ============================================================================
# Références entre modules
# ============================================================================
#
# Outputs de ce module utilisés dans main.tf :
# - bucket_name : Utilisé dans GitHub Secret S3_BUCKET_NAME
# - bucket_arn : Utilisé par module.iam pour la politique d'accès
#
# Voir outputs.tf pour la liste complète des outputs
# Voir infra/GITHUB_SECRETS.md pour la configuration des secrets GitHub
# ============================================================================
