variable "project_name" {
  description = "Nom du projet"
  type        = string
}

variable "environment" {
  description = "Environnement"
  type        = string
}

variable "ami_id" {
  description = "AMI ID pour l'instance EC2"
  type        = string
  default     = "ami-0c7217cdde317cfec" # Amazon Linux 2023 (us-east-1)
}

variable "instance_type" {
  description = "Type d'instance EC2"
  type        = string
  default     = "t3.micro" # Free Tier
}

variable "subnet_id" {
  description = "ID du subnet où déployer l'instance"
  type        = string
}

variable "security_group_id" {
  description = "ID du security group pour l'instance"
  type        = string
}

variable "ssh_public_key" {
  description = "Clé publique SSH pour l'accès"
  type        = string
}

variable "iam_instance_profile_name" {
  description = "Nom de l'instance profile IAM"
  type        = string
}
