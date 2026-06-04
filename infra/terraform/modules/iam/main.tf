# ============================================================================
# Module IAM - Gestion des Accès AWS
# ============================================================================
# Ce module crée les rôles et politiques IAM pour l'instance EC2.
#
# Pourquoi IAM Role ?
# - Principe du moindre privilège : Permissions scoped aux ressources nécessaires
# - Sécurité : Pas de clés d'accès dans le code ou sur l'instance
# - Rotation automatique : Géré par AWS
#
# Pourquoi pas de clés d'accès ?
# - Clés d'accès statiques = risque de fuite
# - IAM Role = identité temporaire, rotation automatique
# - Meilleure pratique AWS : Utiliser IAM Role pour les ressources AWS
#
# Documentation AWS : https://docs.aws.amazon.com/IAM/
# ============================================================================

# ----------------------------------------------------------------------------
# IAM Role pour l'Instance EC2
# ----------------------------------------------------------------------------
# Identité pour l'instance EC2 avec des permissions spécifiques
# Permet à EC2 d'accéder à S3 sans clés d'accès
# ----------------------------------------------------------------------------

resource "aws_iam_role" "ec2_role" {
  name = "${var.project_name}-${var.environment}-ec2-role"
  # Exemple : sorika-dev-ec2-role
  # Nom unique pour le rôle dans le compte AWS

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    # Version de la politique de confiance
    Statement = [
      {
        Action = "sts:AssumeRole"
        # Action STS (Security Token Service) AssumeRole
        # Permet à EC2 d'assumer ce rôle
        Effect = "Allow"
        # Autoriser l'action
        Principal = {
          Service = "ec2.amazonaws.com"
          # Principal = service EC2
          # Seul EC2 peut assumer ce rôle
        }
      }
    ]
  })
  # Politique de confiance = qui peut assumer ce rôle
  # Ici, seul le service EC2 peut assumer ce rôle

  tags = {
    Name        = "${var.project_name}-${var.environment}-ec2-role"
    Environment = var.environment
    Project     = var.project_name
  }
}

# ----------------------------------------------------------------------------
# IAM Policy pour l'Accès S3
# ----------------------------------------------------------------------------
# Politique IAM qui définit les permissions sur le bucket S3
# Principe du moindre privilège : seulement les actions nécessaires
# ----------------------------------------------------------------------------

resource "aws_iam_policy" "s3_access" {
  name        = "${var.project_name}-${var.environment}-s3-policy"
  # Exemple : sorika-dev-s3-policy
  # Nom unique pour la politique dans le compte AWS

  description = "Policy pour l'accès au bucket S3 spécifique"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        # Autoriser les actions

        Action = [
          "s3:PutObject",
          # Permet d'uploader des fichiers vers S3
          # Utilisé par le backend pour stocker les uploads

          "s3:GetObject",
          # Permet de télécharger des fichiers depuis S3
          # Utilisé par le backend pour récupérer les uploads

          "s3:DeleteObject",
          # Permet de supprimer des fichiers dans S3
          # Utilisé par le backend pour supprimer les uploads

          "s3:ListBucket"
          # Permet de lister les objets dans le bucket
          # Utilisé pour la navigation dans les uploads
        ]

        Resource = [
          var.s3_bucket_arn,
          # ARN du bucket S3 (ex: arn:aws:s3:::sorika-dev-uploads)
          # Passé depuis module.storage.bucket_arn

          "${var.s3_bucket_arn}/*"
          # ARN de tous les objets dans le bucket (ex: arn:aws:s3:::sorika-dev-uploads/*)
          # Le /* permet d'accéder à tous les objets
        ]
        # Pourquoi ces ressources ?
        # - Bucket ARN : Pour ListBucket (liste les objets)
        # - Bucket ARN + /* : Pour PutObject, GetObject, DeleteObject (actions sur les objets)
      }
    ]
  })
  # Politique IAM = définit ce que le rôle peut faire
  # Ici : accès complet (Put, Get, Delete, List) au bucket S3 spécifique
}

# ----------------------------------------------------------------------------
# Attachement de la Politique au Rôle
# ----------------------------------------------------------------------------
# Attache la politique S3 au rôle EC2
# Sans cet attachement, le rôle n'a aucune permission
# ----------------------------------------------------------------------------

resource "aws_iam_role_policy_attachment" "s3_attach" {
  role       = aws_iam_role.ec2_role.name
  # Nom du rôle auquel attacher la politique

  policy_arn = aws_iam_policy.s3_access.arn
  # ARN de la politique à attacher
  # La politique créée ci-dessus
}

# ----------------------------------------------------------------------------
# Instance Profile
# ----------------------------------------------------------------------------
# Conteneur pour le rôle IAM qui peut être attaché à une instance EC2
# Instance Profile = wrapper pour IAM Role sur EC2
# ----------------------------------------------------------------------------

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "${var.project_name}-${var.environment}-ec2-profile"
  # Exemple : sorika-dev-ec2-profile
  # Nom unique pour l'instance profile dans le compte AWS

  role = aws_iam_role.ec2_role.name
  # Rôle IAM à attacher à l'instance profile
  # Le rôle créé ci-dessus
}

# Pourquoi Instance Profile ?
# - EC2 ne peut pas être attaché directement à un IAM Role
# - Instance Profile = conteneur pour IAM Role sur EC2
# - L'instance profile est passé à l'instance EC2 lors de sa création

# ============================================================================
# Références entre modules
# ============================================================================
#
# Variables d'entrée passées depuis main.tf :
# - s3_bucket_arn : module.storage.bucket_arn
#
# Outputs de ce module utilisés dans main.tf :
# - iam_role_name : Affiché dans les outputs Terraform
# - instance_profile_name : Utilisé par module.compute (iam_instance_profile_name)
#
# Voir outputs.tf pour la liste complète des outputs
# Voir modules/compute/main.tf pour l'utilisation de instance_profile_name
# Voir infra/GITHUB_SECRETS.md pour les permissions IAM requises
# ============================================================================
