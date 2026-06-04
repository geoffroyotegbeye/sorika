# ============================================================================
# Variables du Module Network
# ============================================================================
# Ce fichier définit les variables d'entrée pour le module network.
# Ces variables sont passées depuis main.tf lors de l'appel du module.
#
# Voir main.tf pour l'appel de ce module et les valeurs passées
# ============================================================================

variable "vpc_cidr" {
  description = "CIDR block du VPC (réseau privé virtuel)"
  type        = string
  # Exemple : 10.0.0.0/16
  # Défini dans variables.tf du module parent
  # 10.0.0.0/16 = 65,536 adresses IP disponibles
}

variable "public_subnet_cidr" {
  description = "CIDR block du subnet public (accessible depuis internet)"
  type        = string
  # Exemple : 10.0.1.0/24
  # 10.0.1.0/24 = 256 adresses IP
  # Héberge l'instance EC2 (backend)
}

variable "private_subnet_cidr" {
  description = "CIDR block du subnet privé (isolé d'internet)"
  type        = string
  # Exemple : 10.0.2.0/24
  # 10.0.2.0/24 = 256 adresses IP
  # Héberge l'instance RDS (base de données)
}

variable "project_name" {
  description = "Nom du projet utilisé pour le nommage des ressources"
  type        = string
  # Exemple : sorika
  # Utilisé pour nommer les ressources : sorika-dev-vpc, sorika-dev-igw, etc.
}

variable "environment" {
  description = "Environnement de déploiement (dev, staging, prod)"
  type        = string
  # Exemple : dev
  # Utilisé pour séparer les environnements
  # Permet d'avoir sorika-dev-vpc et sorika-prod-vpc
}

variable "aws_region" {
  description = "Région AWS où déployer les ressources réseau"
  type        = string
  # Exemple : us-east-1
  # Utilisé pour la zone de disponibilité (us-east-1a, us-east-1b, etc.)
  # Défini dans variables.tf du module parent
}
