# ============================================================================
# Variables du Module Compute
# ============================================================================
# Ce fichier définit les variables d'entrée pour le module compute.
# Ces variables sont passées depuis main.tf lors de l'appel du module.
#
# Voir main.tf pour l'appel de ce module et les valeurs passées
# ============================================================================

variable "project_name" {
  description = "Nom du projet utilisé pour le nommage des ressources"
  type        = string
  # Exemple : sorika
  # Utilisé pour nommer les ressources : sorika-dev-backend, etc.
}

variable "environment" {
  description = "Environnement de déploiement (dev, staging, prod)"
  type        = string
  # Exemple : dev
  # Utilisé pour séparer les environnements
}

variable "ami_id" {
  description = "AMI ID pour l'instance EC2 (image système)"
  type        = string
  # AMI ID passé depuis main.tf via data source
  # Récupéré dynamiquement selon la région AWS
  # Voir data.tf pour la configuration du data source
}

variable "instance_type" {
  description = "Type d'instance EC2 (taille CPU/RAM)"
  type        = string
  default     = "t3.micro"
  # t3.micro = 1 vCPU, 1 GB RAM (Free Tier eligible)
  # Alternatifs : t3.small (2 GB RAM), t3.medium (4 GB RAM)
  # Voir : https://aws.amazon.com/ec2/instance-types/
}

variable "subnet_id" {
  description = "ID du subnet où déployer l'instance EC2"
  type        = string
  # Passé depuis module.network.public_subnet_id
  # L'instance sera placée dans le subnet public
}

variable "security_group_id" {
  description = "ID du security group pour contrôler le trafic de l'instance"
  type        = string
  # Passé depuis module.network.backend_security_group_id
  # Ports ouverts : 3001 (API), 22 (SSH)
}

variable "iam_instance_profile_name" {
  description = "Nom de l'instance profile IAM pour l'accès S3"
  type        = string
  # Passé depuis module.iam.instance_profile_name
  # Permet à EC2 d'accéder à S3 sans clés d'accès
  # Voir modules/iam/main.tf pour la configuration IAM
}
