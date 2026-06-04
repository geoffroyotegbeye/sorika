# ============================================================================
# Outputs Terraform - Valeurs exposées après déploiement
# ============================================================================
# Ce fichier définit les outputs Terraform qui sont affichés après
# `terraform apply`. Ces valeurs sont utilisées pour :
# - Configuration des secrets GitHub
# - Connexion manuelle aux ressources (SSH, base de données)
# - Intégration avec d'autres outils
#
# Comment récupérer les outputs :
#   terraform output
#   terraform output -json (format JSON)
#
# Documentation : voir infra/DEPLOYMENT_GUIDE.md
# ============================================================================

# ----------------------------------------------------------------------------
# Outputs Réseau (VPC, Subnets, Security Groups)
# ----------------------------------------------------------------------------
# Ces outputs sont principalement utilisés pour le debugging et la
# compréhension de l'infrastructure créée. Ils ne sont généralement pas
# nécessaires pour le déploiement de l'application.
# ----------------------------------------------------------------------------

output "vpc_id" {
  description = "ID du VPC créé"
  value       = module.network.vpc_id
  # Utilisé pour : Référence dans d'autres ressources AWS
  # Format : vpc-xxxxxxxxxxxxxxxxx
}

output "public_subnet_id" {
  description = "ID du subnet public (héberge EC2)"
  value       = module.network.public_subnet_id
  # Utilisé pour : Référence pour ajouter des ressources dans le subnet public
  # Format : subnet-xxxxxxxxxxxxxxxxx
}

output "private_subnet_id" {
  description = "ID du subnet privé (héberge RDS)"
  value       = module.network.private_subnet_id
  # Utilisé pour : Référence pour ajouter des ressources dans le subnet privé
  # Format : subnet-xxxxxxxxxxxxxxxxx
}

output "backend_security_group_id" {
  description = "ID du security group pour le backend EC2"
  value       = module.network.backend_security_group_id
  # Utilisé pour : Référence pour ajouter des règles ou attacher à d'autres ressources
  # Ports ouverts : 3001 (API), 22 (SSH)
  # Format : sg-xxxxxxxxxxxxxxxxx
}

output "rds_security_group_id" {
  description = "ID du security group pour RDS PostgreSQL"
  value       = module.network.rds_security_group_id
  # Utilisé pour : Référence pour ajouter des règles d'accès à RDS
  # Ports ouverts : 5432 (PostgreSQL) depuis backend_sg seulement
  # Format : sg-xxxxxxxxxxxxxxxxx
}

# ----------------------------------------------------------------------------
# Outputs Compute (EC2)
# ----------------------------------------------------------------------------
# Ces outputs sont CRITIQUES pour le déploiement de l'application.
# Ils sont utilisés dans les secrets GitHub pour le CI/CD.
# ----------------------------------------------------------------------------

output "ec2_instance_id" {
  description = "ID de l'instance EC2 créée"
  value       = module.compute.instance_id
  # Utilisé pour : Référence dans la console AWS, monitoring
  # Format : i-xxxxxxxxxxxxxxxxx
}

output "ec2_public_ip" {
  description = "IP publique de l'instance EC2"
  value       = module.compute.public_ip
  # IMPORTANT : Utilisé dans GitHub Secret EC2_PUBLIC_IP
  # Utilisé pour :
  # - Connexion SSH : ssh -i sorika_key.pem ec2-user@<IP>
  # - GitHub Actions : déploiement du backend via SSH
  # - Configuration FRONTEND_URL pour le CORS
  #
  # Ajouter ce secret GitHub : voir infra/GITHUB_SECRETS.md
}

output "ec2_private_ip" {
  description = "IP privée de l'instance EC2 dans le VPC"
  value       = module.compute.private_ip
  # Utilisé pour : Communication interne avec RDS (via VPC)
  # Format : 10.0.x.x
  # Note : Non accessible depuis internet
}

# ----------------------------------------------------------------------------
# Outputs Database (RDS PostgreSQL)
# ----------------------------------------------------------------------------
# Ces outputs sont CRITIQUES pour la configuration du backend.
# Ils sont utilisés pour construire la DATABASE_URL.
# ----------------------------------------------------------------------------

output "rds_endpoint" {
  description = "Endpoint de connexion de la base de données RDS"
  value       = module.database.db_endpoint
  # IMPORTANT : Utilisé pour construire DATABASE_URL
  # Format : sorika-dev.xxxxxx.us-east-1.rds.amazonaws.com
  #
  # Construction de DATABASE_URL :
  # postgresql://sorika:PASSWORD@<rds_endpoint>:5432/sorika?schema=public
  #
  # Ajouter ce secret GitHub : voir infra/GITHUB_SECRETS.md
  # Voir infra/DEPLOYMENT_GUIDE.md pour la configuration de la connexion
}

output "rds_port" {
  description = "Port de connexion de la base de données RDS"
  value       = module.database.db_port
  # Utilisé pour : Construction de DATABASE_URL
  # Valeur : 5432 (port PostgreSQL par défaut)
}

# ----------------------------------------------------------------------------
# Outputs Storage (S3)
# ----------------------------------------------------------------------------
# Ces outputs sont utilisés pour la configuration du backend et
# pour les politiques IAM.
# ----------------------------------------------------------------------------

output "s3_bucket_name" {
  description = "Nom du bucket S3 créé"
  value       = module.storage.bucket_name
  # IMPORTANT : Utilisé dans GitHub Secret S3_BUCKET_NAME
  # Utilisé pour : Configuration du backend pour les uploads
  # Format : sorika-dev-uploads
  #
  # Ajouter ce secret GitHub : voir infra/GITHUB_SECRETS.md
}

output "s3_bucket_arn" {
  description = "ARN (Amazon Resource Name) du bucket S3"
  value       = module.storage.bucket_arn
  # Utilisé pour :
  # - Politiques IAM (module.iam utilise cet output)
  # - Référence dans d'autres ressources AWS
  # Format : arn:aws:s3:::sorika-dev-uploads
}

# ----------------------------------------------------------------------------
# Outputs IAM (Rôles et Instance Profiles)
# ----------------------------------------------------------------------------
# Ces outputs sont utilisés pour la vérification et le debugging.
# Ils ne sont généralement pas nécessaires pour le déploiement.
# ----------------------------------------------------------------------------

output "iam_role_name" {
  description = "Nom du IAM Role créé pour EC2"
  value       = module.iam.iam_role_name
  # Utilisé pour : Vérification dans la console AWS IAM
  # Format : sorika-dev-ec2-role
  # Permissions : Accès S3 au bucket spécifique
}

output "instance_profile_name" {
  description = "Nom de l'Instance Profile attaché à EC2"
  value       = module.iam.instance_profile_name
  # Utilisé pour : Vérification que l'instance profile est correctement attaché
  # Format : sorika-dev-ec2-instance-profile
  # Note : Instance Profile = conteneur pour IAM Role sur EC2
}

# ============================================================================
# Utilisation des outputs pour le déploiement
# ============================================================================
#
# Après `terraform apply`, récupérer les outputs avec :
#   terraform output -json > outputs.json
#
# Utiliser ces valeurs pour configurer les secrets GitHub :
# - EC2_PUBLIC_IP → depuis output ec2_public_ip
# - DATABASE_URL → construit depuis rds_endpoint et rds_port
# - S3_BUCKET_NAME → depuis output s3_bucket_name
#
# Voir infra/GITHUB_SECRETS.md pour la configuration complète des secrets
# Voir infra/DEPLOYMENT_GUIDE.md pour le guide de déploiement
# ============================================================================
