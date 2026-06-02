output "instance_id" {
  description = "ID de l'instance EC2"
  value       = aws_instance.backend.id
}

output "public_ip" {
  description = "IP publique de l'instance"
  value       = aws_instance.backend.public_ip
}

output "private_ip" {
  description = "IP privée de l'instance"
  value       = aws_instance.backend.private_ip
}
