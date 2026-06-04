# ============================================================================
# Variables du Module Storage
# ============================================================================
# Ce fichier définit les variables d'entrée pour le module storage.
# Ces variables sont passées depuis main.tf lors de l'appel du module.
#
# Voir main.tf pour l'appel de ce module et les valeurs passées
# ============================================================================

variable "project_name" {
  description = "Nom du projet utilisé pour le nommage du bucket S3"
  type        = string
  # Exemple : sorika
  # Utilisé pour nommer le bucket : sorika-dev-uploads
}

variable "environment" {
  description = "Environnement de déploiement (dev, staging, prod)"
  type        = string
  # Exemple : dev
  # Utilisé pour séparer les environnements
  # Permet d'avoir sorika-dev-uploads et sorika-prod-uploads
}
