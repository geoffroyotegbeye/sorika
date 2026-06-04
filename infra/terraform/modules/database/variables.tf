# ============================================================================
# Variables du Module Database
# ============================================================================
# Ce fichier définit les variables d'entrée pour le module database.
# Ces variables sont passées depuis main.tf lors de l'appel du module.
#
# Voir main.tf pour l'appel de ce module et les valeurs passées
# ============================================================================

variable "project_name" {
  description = "Nom du projet utilisé pour le nommage des ressources"
  type        = string
  # Exemple : sorika
  # Utilisé pour nommer les ressources : sorika-dev-rds, etc.
}

variable "environment" {
  description = "Environnement de déploiement (dev, staging, prod)"
  type        = string
  # Exemple : dev
  # Utilisé pour séparer les environnements
}

variable "instance_class" {
  description = "Type d'instance RDS (taille CPU/RAM)"
  type        = string
  default     = "db.t3.micro"
  # db.t3.micro = 1 vCPU, 1 GB RAM, 20 GB storage (Free Tier eligible)
  # Alternatifs : db.t3.small (2 GB RAM), db.t3.medium (4 GB RAM)
  # Voir : https://aws.amazon.com/rds/instance-types/
}

variable "allocated_storage" {
  description = "Espace disque alloué pour RDS en GB"
  type        = number
  default     = 20
  # 20 GB = limite Free Tier
  # Peut être augmenté jusqu'à 64 TB pour db.t3.micro
  # Pour la prod, augmenter selon les besoins
}

variable "db_name" {
  description = "Nom de la base de données initiale créée automatiquement"
  type        = string
  default     = "sorika"
  # Nom de la base créée automatiquement par RDS
  # Utilisé pour construire la DATABASE_URL
}

variable "db_username" {
  description = "Nom d'utilisateur administrateur RDS"
  type        = string
  default     = "sorika"
  # Utilisateur avec tous les privilèges sur la base
  # Utilisé pour construire la DATABASE_URL
}

variable "subnet_id" {
  description = "ID du subnet privé où déployer RDS"
  type        = string
  # Passé depuis module.network.private_subnet_id
  # RDS sera dans le subnet privé (sécurité)
}

variable "security_group_id" {
  description = "ID du security group pour contrôler le trafic RDS"
  type        = string
  # Passé depuis module.network.rds_security_group_id
  # Ports ouverts : 5432 (PostgreSQL) depuis backend_sg seulement
}
