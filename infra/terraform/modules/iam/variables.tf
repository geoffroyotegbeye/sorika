variable "project_name" {
  description = "Nom du projet"
  type        = string
}

variable "environment" {
  description = "Environnement"
  type        = string
}

variable "s3_bucket_arn" {
  description = "ARN du bucket S3"
  type        = string
}
