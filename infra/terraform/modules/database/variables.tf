variable "project_name" {
  description = "Nom du projet"
  type        = string
}

variable "environment" {
  description = "Environnement"
  type        = string
}

variable "instance_class" {
  description = "Type d'instance RDS"
  type        = string
  default     = "db.t3.micro" # Free Tier
}

variable "allocated_storage" {
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

variable "subnet_id" {
  description = "ID du subnet privé"
  type        = string
}

variable "security_group_id" {
  description = "ID du security group RDS"
  type        = string
}
