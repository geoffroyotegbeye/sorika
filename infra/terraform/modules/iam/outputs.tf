output "iam_role_name" {
  description = "Nom du IAM role"
  value       = aws_iam_role.ec2_role.name
}

output "instance_profile_name" {
  description = "Nom de l'instance profile"
  value       = aws_iam_instance_profile.ec2_profile.name
}
