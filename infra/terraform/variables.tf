variable "aws_region" {
  description = "Région AWS"
  type        = string
  default     = "us-east-1"
}

variable "vpc_cidr" {
  description = "CIDR block du VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "CIDR block du subnet public"
  type        = string
  default     = "10.0.1.0/24"
}

variable "private_subnet_cidr" {
  description = "CIDR block du subnet privé"
  type        = string
  default     = "10.0.2.0/24"
}

variable "project_name" {
  description = "Nom du projet"
  type        = string
  default     = "sorika"
}

variable "environment" {
  description = "Environnement (dev, prod)"
  type        = string
  default     = "dev"
}

# Variables pour EC2
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

variable "ssh_public_key" {
  description = "Clé publique SSH pour l'accès"
  type        = string
  sensitive   = true
}

# Variables pour RDS
variable "db_instance_class" {
  description = "Type d'instance RDS"
  type        = string
  default     = "db.t3.micro" # Free Tier
}

variable "db_allocated_storage" {
  description = "Stockage alloué en GB"
  type        = number
  default     = 20 # Free Tier
}

variable "db_name" {
  description = "Nom de la base de données"
  type        = string
  default     = "sorika"
}

variable "db_username" {
  description = "Nom d'utilisateur de la base"
  type        = string
  default     = "sorika"
}

variable "db_password" {
  description = "Mot de passe de la base"
  type        = string
  sensitive   = true
}
