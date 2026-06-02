# Bucket S3 pour les uploads
resource "aws_s3_bucket" "main" {
  bucket = "${var.project_name}-${var.environment}-uploads"

  tags = {
    Name        = "${var.project_name}-${var.environment}-s3"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Blocage de l'accès public
resource "aws_s3_bucket_public_access_block" "main" {
  bucket = aws_s3_bucket.main.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Versioning (optionnel, pour récupérer les versions précédentes)
resource "aws_s3_bucket_versioning" "main" {
  bucket = aws_s3_bucket.main.id
  versioning_configuration {
    status = "Enabled"
  }
}

# Lifecycle rules (transition vers Glacier après 30 jours)
resource "aws_s3_bucket_lifecycle_configuration" "main" {
  bucket = aws_s3_bucket.main.id

  rule {
    id     = "archive-old-files"
    status = "Enabled"

    transition {
      days          = 30
      storage_class = "GLACIER"
    }

    noncurrent_version_transition {
      days          = 30
      storage_class = "GLACIER"
    }
  }
}
