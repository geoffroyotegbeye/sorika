# ============================================================================
# Outputs du Module Storage
# ============================================================================
# Ce fichier définit les valeurs exposées par le module storage.
# Ces outputs sont utilisés pour la configuration du backend et des politiques IAM.
#
# Pourquoi ces outputs ?
# - Permet de configurer le backend pour les uploads S3
# - Utilisé dans GitHub Secrets pour le CI/CD
# - Utilisé par le module IAM pour créer la politique d'accès
# ============================================================================

output "bucket_name" {
  description = "Nom du bucket S3 créé"
  value       = aws_s3_bucket.main.id
  # IMPORTANT : Utilisé dans GitHub Secret S3_BUCKET_NAME
  # Utilisé pour : Configuration du backend pour les uploads
  # Format : sorika-dev-uploads
  #
  # Ajouter ce secret GitHub : voir infra/GITHUB_SECRETS.md
}

output "bucket_arn" {
  description = "ARN (Amazon Resource Name) du bucket S3"
  value       = aws_s3_bucket.main.arn
  # IMPORTANT : Utilisé par module.iam pour créer la politique d'accès
  # Utilisé pour :
  # - Politiques IAM (module.iam utilise cet output)
  # - Référence dans d'autres ressources AWS
  # Format : arn:aws:s3:::sorika-dev-uploads
}

# ============================================================================
# Références entre modules
# ============================================================================
#
# Ces outputs sont utilisés dans main.tf :
# - bucket_name → Utilisé dans GitHub Secret S3_BUCKET_NAME
# - bucket_arn → Utilisé par module.iam (s3_bucket_arn)
#
# Voir outputs.tf (racine) pour l'utilisation de ces outputs
# Voir infra/GITHUB_SECRETS.md pour la configuration des secrets GitHub
# Voir modules/iam/main.tf pour l'utilisation de bucket_arn
# ============================================================================
