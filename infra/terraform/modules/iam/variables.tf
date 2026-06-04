# ============================================================================
# Variables du Module IAM
# ============================================================================
# Ce fichier définit les variables d'entrée pour le module IAM.
# Ces variables sont passées depuis main.tf lors de l'appel du module.
#
# Voir main.tf pour l'appel de ce module et les valeurs passées
# ============================================================================

variable "project_name" {
  description = "Nom du projet utilisé pour le nommage des ressources IAM"
  type        = string
  # Exemple : sorika
  # Utilisé pour nommer les ressources : sorika-dev-ec2-role, etc.
}

variable "environment" {
  description = "Environnement de déploiement (dev, staging, prod)"
  type        = string
  # Exemple : dev
  # Utilisé pour séparer les environnements
}

variable "s3_bucket_arn" {
  description = "ARN du bucket S3 pour les permissions IAM"
  type        = string
  # Passé depuis module.storage.bucket_arn
  # Utilisé pour créer la politique IAM qui autorise l'accès à ce bucket
  # Format : arn:aws:s3:::sorika-dev-uploads
  #
  # Pourquoi l'ARN et pas le nom du bucket ?
  # - ARN = identifiant unique global
  # - Plus sécurisé : permissions scoped à une ressource spécifique
  # - Meilleure pratique AWS : utiliser ARN pour les politiques IAM
}
