# Outputs réseau
output "vpc_id" {
  description = "ID du VPC"
  value       = module.network.vpc_id
}

output "public_subnet_id" {
  description = "ID du subnet public"
  value       = module.network.public_subnet_id
}

output "private_subnet_id" {
  description = "ID du subnet privé"
  value       = module.network.private_subnet_id
}

output "backend_security_group_id" {
  description = "ID du security group backend"
  value       = module.network.backend_security_group_id
}

output "rds_security_group_id" {
  description = "ID du security group RDS"
  value       = module.network.rds_security_group_id
}

# Outputs compute
output "ec2_instance_id" {
  description = "ID de l'instance EC2"
  value       = module.compute.instance_id
}

output "ec2_public_ip" {
  description = "IP publique de l'instance EC2"
  value       = module.compute.public_ip
}

output "ec2_private_ip" {
  description = "IP privée de l'instance EC2"
  value       = module.compute.private_ip
}

# Outputs database
output "rds_endpoint" {
  description = "Endpoint de la base de données RDS"
  value       = module.database.db_endpoint
}

output "rds_port" {
  description = "Port de la base de données RDS"
  value       = module.database.db_port
}

# Outputs storage
output "s3_bucket_name" {
  description = "Nom du bucket S3"
  value       = module.storage.bucket_name
}

output "s3_bucket_arn" {
  description = "ARN du bucket S3"
  value       = module.storage.bucket_arn
}

# Outputs IAM
output "iam_role_name" {
  description = "Nom du IAM role pour EC2"
  value       = module.iam.iam_role_name
}

output "instance_profile_name" {
  description = "Nom de l'instance profile"
  value       = module.iam.instance_profile_name
}
