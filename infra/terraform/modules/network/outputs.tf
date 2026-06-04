# ============================================================================
# Outputs du Module Network
# ============================================================================
# Ce fichier définit les valeurs exposées par le module network.
# Ces outputs sont utilisés par les autres modules (compute, database).
#
# Pourquoi ces outputs ?
# - Permet aux autres modules de référencer les ressources créées ici
# - Évite de dupliquer la logique de création des ressources
# - Garantit que les dépendances sont correctes
# ============================================================================

output "vpc_id" {
  description = "ID du VPC créé"
  value       = aws_vpc.main.id
  # Utilisé par : Référence générale pour d'autres ressources AWS
  # Format : vpc-xxxxxxxxxxxxxxxxx
}

output "public_subnet_id" {
  description = "ID du subnet public (héberge EC2)"
  value       = aws_subnet.public.id
  # IMPORTANT : Utilisé par module.compute
  # L'instance EC2 sera placée dans ce subnet
  # Format : subnet-xxxxxxxxxxxxxxxxx
}

output "private_subnet_id" {
  description = "ID du subnet privé (héberge RDS)"
  value       = aws_subnet.private.id
  # IMPORTANT : Utilisé par module.database
  # L'instance RDS sera placée dans ce subnet
  # Format : subnet-xxxxxxxxxxxxxxxxx
}

output "backend_security_group_id" {
  description = "ID du security group pour le backend EC2"
  value       = aws_security_group.backend.id
  # IMPORTANT : Utilisé par module.compute
  # Attaché à l'instance EC2 pour contrôler le trafic
  # Ports ouverts : 3001 (API), 22 (SSH)
  # Format : sg-xxxxxxxxxxxxxxxxx
}

output "rds_security_group_id" {
  description = "ID du security group pour RDS PostgreSQL"
  value       = aws_security_group.rds.id
  # IMPORTANT : Utilisé par module.database
  # Attaché à l'instance RDS pour contrôler le trafic
  # Ports ouverts : 5432 (PostgreSQL) depuis backend_sg seulement
  # Format : sg-xxxxxxxxxxxxxxxxx
}

# ============================================================================
# Références entre modules
# ============================================================================
#
# Ces outputs sont utilisés dans main.tf :
# - public_subnet_id → module.compute.subnet_id
# - private_subnet_id → module.database.subnet_id
# - backend_security_group_id → module.compute.security_group_id
# - rds_security_group_id → module.database.security_group_id
#
# Voir main.tf pour l'utilisation de ces outputs
# ============================================================================
