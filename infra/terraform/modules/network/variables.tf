variable "vpc_cidr" {
  description = "CIDR block du VPC"
  type        = string
}

variable "public_subnet_cidr" {
  description = "CIDR block du subnet public"
  type        = string
}

variable "private_subnet_cidr" {
  description = "CIDR block du subnet privé"
  type        = string
}

variable "project_name" {
  description = "Nom du projet"
  type        = string
}

variable "environment" {
  description = "Environnement"
  type        = string
}

variable "aws_region" {
  description = "Région AWS"
  type        = string
}
