# ============================================================================
# Main Terraform Configuration - Infrastructure AWS Sorika
# ============================================================================
# Ce fichier est le point d'entrée de l'infrastructure Terraform.
# Il orchestre tous les modules pour créer l'infrastructure complète sur AWS.
#
# Ordre de création des ressources (géré par Terraform via depends_on) :
# 1. Storage (S3) → Créé en premier car IAM en dépend
# 2. Network (VPC, subnets) → Fondation réseau
# 3. IAM (rôles et politiques) → Dépend de Storage
# 4. Compute (EC2) → Dépend de Network et IAM
# 5. Database (RDS) → Dépend de Network
#
# Documentation complète : voir infra/DEPLOYMENT_GUIDE.md
# Secrets GitHub requis : voir infra/GITHUB_SECRETS.md
# ============================================================================

# ----------------------------------------------------------------------------
# Configuration Terraform et Provider AWS
# ----------------------------------------------------------------------------

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
      # Version 5.x du provider AWS (stable, supporte les dernières fonctionnalités)
      # Voir : https://registry.terraform.io/providers/hashicorp/aws/latest/docs
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
      # Provider random pour la génération de mots de passe sécurisés
      # Utilisé par random_password dans le module database
      # Voir : https://registry.terraform.io/providers/hashicorp/random/latest/docs
    }
  }
  # Terraform state est stocké localement dans .terraform/terraform.tfstate
  # Pour la production, utiliser un backend distant (S3 + DynamoDB) pour le partage d'état
  # Voir : https://www.terraform.io/docs/language/settings/backends/index.html
}

provider "aws" {
  region = var.aws_region
  # La région est définie dans variables.tf (default: us-east-1)
  # Credentials sont lus depuis :
  # - Variables d'environnement AWS_ACCESS_KEY_ID et AWS_SECRET_ACCESS_KEY
  # - Ou fichier ~/.aws/credentials (configuré avec 'aws configure')
  # Voir infra/DEPLOYMENT_GUIDE.md pour la configuration AWS
}

# ----------------------------------------------------------------------------
# Module Storage (S3) - Stockage des fichiers uploadés
# ----------------------------------------------------------------------------
# Créé en PREMIER car le module IAM en dépend (besoin du bucket ARN)
# ----------------------------------------------------------------------------

module "storage" {
  source = "./modules/storage"

  project_name = var.project_name
  environment  = var.environment

  # Ce module crée :
  # - Bucket S3 pour stocker les uploads (images, documents)
  # - Blocage d'accès public (sécurité)
  # - Versioning (récupération des fichiers supprimés)
  # - Lifecycle rules (transition vers Glacier pour économies)
  #
  # Outputs utilisés par :
  # - module.iam (s3_bucket_arn) pour créer la politique d'accès
  #
  # Voir : modules/storage/main.tf pour la configuration détaillée
}

# ----------------------------------------------------------------------------
# Module Network (VPC, Subnets, Security Groups)
# ----------------------------------------------------------------------------
# Fondation réseau - créé en DEUXIÈME
# ----------------------------------------------------------------------------

module "network" {
  source = "./modules/network"

  vpc_cidr          = var.vpc_cidr
  public_subnet_cidr  = var.public_subnet_cidr
  private_subnet_cidr = var.private_subnet_cidr
  project_name      = var.project_name
  environment       = var.environment
  aws_region        = var.aws_region

  # Ce module crée :
  # - VPC (réseau privé virtuel) : 10.0.0.0/16
  # - Public subnet : 10.0.1.0/24 (accessible depuis internet)
  # - Private subnet : 10.0.2.0/24 (isolé d'internet)
  # - Internet Gateway : pour l'accès internet du subnet public
  # - Route tables : routage entre subnets et internet
  # - Security groups :
  #   * backend_sg : ports 3001 (API) et 22 (SSH)
  #   * rds_sg : port 5432 (PostgreSQL) depuis backend_sg seulement
  #
  # Outputs utilisés par :
  # - module.compute (public_subnet_id, backend_security_group_id)
  # - module.database (private_subnet_id, rds_security_group_id)
  #
  # Pourquoi cette architecture ?
  # - Defense in Depth : RDS dans subnet privé = pas d'accès direct internet
  # - Segmentation : Séparation publique (backend) et privé (database)
  #
  # Voir : modules/network/main.tf pour la configuration détaillée
}

# ----------------------------------------------------------------------------
# Module IAM (Rôles et Politiques) - Gestion des accès AWS
# ----------------------------------------------------------------------------
# Créé en TROISIÈME car il dépend du module Storage
# ----------------------------------------------------------------------------

module "iam" {
  source = "./modules/iam"

  project_name = var.project_name
  environment  = var.environment
  s3_bucket_arn = module.storage.bucket_arn

  depends_on = [module.storage]
  # depends_on explicite : IAM doit attendre que le bucket S3 existe
  # Terraform détecte automatiquement la dépendance via module.storage.bucket_arn
  # mais depends_on garantit l'ordre de création

  # Ce module crée :
  # - IAM Role pour EC2 : permet à l'instance EC2 d'accéder à S3
  # - IAM Policy : autorise l'accès au bucket S3 spécifique
  # - Instance Profile : attache le rôle à l'instance EC2
  #
  # Pourquoi IAM Role au lieu de clés d'accès ?
  # - Principe du moindre privilège : permissions scoped aux ressources nécessaires
  # - Sécurité : pas de clés d'accès dans le code ou sur l'instance
  # - Rotation automatique : géré par AWS
  #
  # Outputs utilisés par :
  # - module.compute (iam_instance_profile_name)
  #
  # Voir : modules/iam/main.tf pour la configuration détaillée
  # Voir infra/GITHUB_SECRETS.md pour les permissions IAM requises
}

# ----------------------------------------------------------------------------
# Module Compute (EC2) - Backend NestJS
# ----------------------------------------------------------------------------
# Créé en QUATRIÈME car il dépend de Network et IAM
# ----------------------------------------------------------------------------

module "compute" {
  source = "./modules/compute"

  project_name           = var.project_name
  environment            = var.environment
  ami_id                 = data.aws_ami.amazon_linux.id
  # Utilise le data source pour récupérer dynamiquement l'AMI Amazon Linux 2023
  # Fonctionne dans n'importe quelle région AWS
  instance_type          = var.instance_type
  subnet_id              = module.network.public_subnet_id
  security_group_id      = module.network.backend_security_group_id
  iam_instance_profile_name = module.iam.instance_profile_name

  depends_on = [module.network, module.iam]
  # depends_on explicite : EC2 doit attendre que le réseau et IAM existent

  # Ce module crée :
  # - Instance EC2 t3.micro (1 vCPU, 1 GB RAM) - Free Tier eligible
  # - Clé SSH injectée pour l'accès administrateur
  # - IAM Instance Profile attaché pour l'accès S3
  # - User data : script exécuté au démarrage pour installer Docker
  #
  # Variables sensibles requises :
  # - ssh_public_key : clé publique SSH (voir variables.tf)
  #   Générée avec : ssh-keygen -t rsa -f sorika_key
  #
  # Outputs utilisés par :
  # - Déploiement manuel : EC2_PUBLIC_IP (pour SSH)
  # - GitHub Secrets : EC2_PUBLIC_IP (pour le déploiement CI/CD)
  #
  # Pourquoi EC2 au lieu de serverless (Lambda) ?
  # - Contrôle total : Docker, configuration personnalisée
  # - Coût prévisible : Free Tier 12 mois
  # - Adapté pour un backend API avec dépendances lourdes
  #
  # Voir : modules/compute/main.tf pour la configuration détaillée
  # Voir infra/DEPLOYMENT_GUIDE.md pour le déploiement sur EC2
}

# ----------------------------------------------------------------------------
# Module Database (RDS) - PostgreSQL
# ----------------------------------------------------------------------------
# Créé en CINQUIÈME car il dépend de Network
# ----------------------------------------------------------------------------

module "database" {
  source = "./modules/database"

  project_name       = var.project_name
  environment        = var.environment
  instance_class     = var.db_instance_class
  allocated_storage  = var.db_allocated_storage
  db_name            = var.db_name
  db_username        = var.db_username
  subnet_id          = module.network.private_subnet_id
  security_group_id  = module.network.rds_security_group_id

  depends_on = [module.network]
  # depends_on explicite : RDS doit attendre que le réseau existe

  # Ce module crée :
  # - Instance RDS PostgreSQL db.t3.micro (1 vCPU, 1 GB RAM, 20 GB) - Free Tier
  # - Subnet group : place RDS dans le subnet privé
  # - Backups automatiques : 7 jours de rétention
  # - Performance insights : monitoring des performances
  #
  # Variables sensibles requises :
  # - db_password : mot de passe administrateur (voir variables.tf)
  #   Doit être fourni via terraform.tfvars (jamais commité)
  #
  # Outputs utilisés par :
  # - GitHub Secrets : DATABASE_URL (endpoint RDS pour le backend)
  #
  # Pourquoi RDS au lieu de PostgreSQL sur EC2 ?
  # - Managé : backups automatiques, patching automatique
  # - HA : Multi-AZ possible pour la production
  # - Sécurité : dans subnet privé, pas d'accès direct internet
  #
  # Voir : modules/database/main.tf pour la configuration détaillée
  # Voir infra/DEPLOYMENT_GUIDE.md pour la configuration de la connexion
}

# ============================================================================
# Notes pour le déploiement
# ============================================================================
#
# 1. Initialisation :
#    cd infra/terraform
#    terraform init
#
# 2. Configuration des variables sensibles :
#    cp terraform.tfvars.example terraform.tfvars
#    # Éditer terraform.tfvars avec tes valeurs
#
# 3. Vérification du plan :
#    terraform plan
#
# 4. Application :
#    terraform apply
#
# 5. Récupération des outputs :
#    terraform output -json
#
# 6. Nettoyage (arrêter de payer) :
#    terraform destroy
#
# Voir infra/DEPLOYMENT_GUIDE.md pour le guide complet
# Voir infra/GITHUB_SECRETS.md pour la configuration des secrets GitHub
# ============================================================================
