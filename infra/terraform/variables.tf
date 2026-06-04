# ============================================================================
# Variables Terraform - Configuration Infrastructure AWS
# ============================================================================
# Ce fichier définit toutes les variables configurables pour l'infrastructure.
# Les valeurs par défaut sont optimisées pour le AWS Free Tier.
# ============================================================================

# ----------------------------------------------------------------------------
# Configuration de base
# ----------------------------------------------------------------------------

variable "aws_region" {
  description = "Région AWS où déployer l'infrastructure"
  type        = string
  default = "eu-west-3"
  # Note : AWS ne différencie pas fortement les avantages Free Tier selon les régions.
  # Le choix de la région doit surtout se baser sur la latence et les utilisateurs cibles.
}

variable "project_name" {
  description = "Nom du projet utilisé pour le nommage des ressources AWS"
  type        = string
  default     = "sorika"
  # Exemple: Les ressources seront nommées 'sorika-vpc', 'sorika-ec2', etc.
}

variable "environment" {
  description = "Environnement de déploiement (dev, staging, prod)"
  type        = string
  default     = "dev"
  # Utilisé pour séparer les environnements (dev, staging, prod)
}

# ----------------------------------------------------------------------------
# Configuration réseau (VPC et Subnets)
# ----------------------------------------------------------------------------

variable "vpc_cidr" {
  description = "CIDR block du VPC (réseau privé virtuel)"
  type        = string
  default     = "10.0.0.0/16"
  # 10.0.0.0/16 = 65,536 adresses IP disponibles
  # Suffixé par /16 pour permettre ~256 subnets de /24
}

variable "public_subnet_cidr" {
  description = "CIDR block du subnet public (accessible depuis internet)"
  type        = string
  default     = "10.0.1.0/24"
  # 10.0.1.0/24 = 256 adresses IP
  # Héberge l'instance EC2 (backend) accessible via Internet Gateway
}

variable "private_subnet_cidr" {
  description = "CIDR block du subnet privé (isolé d'internet)"
  type        = string
  default     = "10.0.2.0/24"
  # 10.0.2.0/24 = 256 adresses IP
  # Héberge l'instance RDS (base de données) pour la sécurité
}

# ----------------------------------------------------------------------------
# Configuration EC2 (Backend)
# ----------------------------------------------------------------------------

variable "instance_type" {
  description = "Type d'instance EC2 (taille CPU/RAM)"
  type        = string
  default     = "t3.micro"
  # t3.micro = 1 vCPU, 1 GB RAM (Free Tier eligible)
  # Alternatifs: t3.small (2 GB RAM), t3.medium (4 GB RAM)
}

# ----------------------------------------------------------------------------
# Configuration RDS (Base de données)
# ----------------------------------------------------------------------------

variable "db_instance_class" {
  description = "Type d'instance RDS (taille CPU/RAM)"
  type        = string
  default     = "db.t3.micro"
  # db.t3.micro = 1 vCPU, 1 GB RAM, 20 GB storage (Free Tier eligible)
  # Alternatifs: db.t3.small (2 GB RAM), db.t3.medium (4 GB RAM)
}

variable "db_allocated_storage" {
  description = "Espace disque alloué pour RDS en GB"
  type        = number
  default     = 20
  # 20 GB = limite Free Tier
  # Peut être augmenté jusqu'à 64 TB pour db.t3.micro
}

variable "db_name" {
  description = "Nom de la base de données initiale"
  type        = string
  default     = "sorika"
  # Nom de la base créée automatiquement par RDS
}

variable "db_username" {
  description = "Nom d'utilisateur administrateur RDS"
  type        = string
  default     = "sorika"
  # Utilisateur admin pour la connexion à la base
}
