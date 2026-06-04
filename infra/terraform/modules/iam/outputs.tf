# ============================================================================
# Outputs du Module IAM
# ============================================================================
# Ce fichier définit les valeurs exposées par le module IAM.
# Ces outputs sont utilisés pour attacher le rôle IAM à l'instance EC2.
#
# Pourquoi ces outputs ?
# - Permet de référencer l'instance profile dans module.compute
# - Permet de vérifier que le rôle est correctement créé
# ============================================================================

output "iam_role_name" {
  description = "Nom du IAM Role créé pour EC2"
  value       = aws_iam_role.ec2_role.name
  # Utilisé pour : Vérification dans la console AWS IAM
  # Format : sorika-dev-ec2-role
  # Permissions : Accès S3 au bucket spécifique
}

output "instance_profile_name" {
  description = "Nom de l'Instance Profile attaché à EC2"
  value       = aws_iam_instance_profile.ec2_profile.name
  # IMPORTANT : Utilisé par module.compute (iam_instance_profile_name)
  # L'instance profile est passé à l'instance EC2 lors de sa création
  # Permet à EC2 d'avoir les permissions IAM sans clés d'accès
  # Format : sorika-dev-ec2-profile
}

# ============================================================================
# Références entre modules
# ============================================================================
#
# Ces outputs sont utilisés dans main.tf :
# - iam_role_name → Affiché dans les outputs Terraform
# - instance_profile_name → Utilisé par module.compute (iam_instance_profile_name)
#
# Voir modules/compute/main.tf pour l'utilisation de instance_profile_name
# Voir infra/GITHUB_SECRETS.md pour les permissions IAM requises
# ============================================================================
