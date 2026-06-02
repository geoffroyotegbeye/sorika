output "vpc_id" {
  description = "ID du VPC"
  value       = aws_vpc.main.id
}

output "public_subnet_id" {
  description = "ID du subnet public"
  value       = aws_subnet.public.id
}

output "private_subnet_id" {
  description = "ID du subnet privé"
  value       = aws_subnet.private.id
}

output "backend_security_group_id" {
  description = "ID du security group backend"
  value       = aws_security_group.backend.id
}

output "rds_security_group_id" {
  description = "ID du security group RDS"
  value       = aws_security_group.rds.id
}
