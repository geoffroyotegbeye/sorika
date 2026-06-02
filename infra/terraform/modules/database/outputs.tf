output "db_instance_id" {
  description = "ID de l'instance RDS"
  value       = aws_db_instance.main.id
}

output "db_endpoint" {
  description = "Endpoint de la base de données"
  value       = aws_db_instance.main.endpoint
}

output "db_port" {
  description = "Port de la base de données"
  value       = aws_db_instance.main.port
}
