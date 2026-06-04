# ============================================================================
# Outputs du Module Compute
# ============================================================================
# Ce fichier définit les valeurs exposées par le module compute.
# Ces outputs sont utilisés pour le déploiement et la configuration.
#
# Pourquoi ces outputs ?
# - Permet de récupérer l'IP publique pour SSH
# - Utilisé dans GitHub Secrets pour le CI/CD
# - Permet de construire l'URL du backend pour le frontend
# ============================================================================

output "instance_id" {
  description = "ID de l'instance EC2 créée"
  value       = aws_instance.backend.id
  # Utilisé pour : Référence dans la console AWS, monitoring
  # Format : i-xxxxxxxxxxxxxxxxx
}

output "public_ip" {
  description = "IP publique de l'instance EC2"
  value       = aws_instance.backend.public_ip
  # IMPORTANT : Utilisé dans GitHub Secret EC2_PUBLIC_IP
  # Utilisé pour :
  # - Connexion SSH : ssh -i sorika_key.pem ec2-user@<IP>
  # - GitHub Actions : déploiement du backend via SSH
  # - Configuration FRONTEND_URL pour le CORS
  #
  # Ajouter ce secret GitHub : voir infra/GITHUB_SECRETS.md
  # Format : x.x.x.x (adresse IP publique)
}

output "private_ip" {
  description = "IP privée de l'instance EC2 dans le VPC"
  value       = aws_instance.backend.private_ip
  # Utilisé pour : Communication interne avec RDS (via VPC)
  # Note : Non accessible depuis internet
  # Format : 10.0.x.x (adresse IP privée)
}

# ============================================================================
# Références entre modules
# ============================================================================
#
# Ces outputs sont utilisés dans main.tf (outputs.tf) :
# - instance_id → Affiché dans les outputs Terraform
# - public_ip → Utilisé dans GitHub Secret EC2_PUBLIC_IP
# - private_ip → Affiché dans les outputs Terraform
#
# Voir outputs.tf (racine) pour l'utilisation de ces outputs
# Voir infra/GITHUB_SECRETS.md pour la configuration des secrets GitHub
# ============================================================================
