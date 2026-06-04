# ============================================================================
# Outputs du Module Database
# ============================================================================
# Ce fichier définit les valeurs exposées par le module database.
# Ces outputs sont utilisés pour la configuration du backend.
#
# Pourquoi ces outputs ?
# - Permet de construire la DATABASE_URL pour le backend
# - Utilisé dans GitHub Secrets pour le CI/CD
# - Permet de se connecter manuellement à la base de données
# ============================================================================

output "db_instance_id" {
  description = "ID de l'instance RDS créée"
  value       = aws_db_instance.main.id
  # Utilisé pour : Référence dans la console AWS, monitoring
  # Format : db-xxxxxxxxxxxxxxxxx
}

output "db_endpoint" {
  description = "Endpoint de connexion de la base de données RDS"
  value       = aws_db_instance.main.endpoint
  # IMPORTANT : Utilisé pour construire DATABASE_URL
  # Format : sorika-dev.xxxxxx.us-east-1.rds.amazonaws.com:5432
  #
  # Construction de DATABASE_URL :
  # postgresql://sorika:PASSWORD@<db_endpoint>:5432/sorika?schema=public
  #
  # Ajouter ce secret GitHub : voir infra/GITHUB_SECRETS.md
  # Voir infra/DEPLOYMENT_GUIDE.md pour la configuration de la connexion
}

output "db_port" {
  description = "Port de connexion de la base de données RDS"
  value       = aws_db_instance.main.port
  # Utilisé pour : Construction de DATABASE_URL
  # Valeur : 5432 (port PostgreSQL par défaut)
}

output "db_password" {
  description = "Mot de passe administrateur RDS généré automatiquement"
  value       = random_password.db.result
  sensitive   = true
  # IMPORTANT : Mot de passe généré automatiquement par random_password
  # Utilisé pour : Construction de DATABASE_URL
  # Pour récupérer : terraform output db_password
  # Note : Le mot de passe n'est pas stocké dans le state Terraform
}

# ============================================================================
# Références entre modules
# ============================================================================
#
# Ces outputs sont utilisés dans main.tf (outputs.tf) :
# - db_instance_id → Affiché dans les outputs Terraform
# - db_endpoint → Utilisé pour construire DATABASE_URL
# - db_port → Utilisé pour construire DATABASE_URL
#
# Voir outputs.tf (racine) pour l'utilisation de ces outputs
# Voir infra/GITHUB_SECRETS.md pour la configuration des secrets GitHub
# Voir infra/DEPLOYMENT_GUIDE.md pour la configuration de la connexion
# ============================================================================
