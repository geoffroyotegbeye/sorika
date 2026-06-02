# Key pair pour SSH
resource "aws_key_pair" "main" {
  key_name   = "${var.project_name}-${var.environment}-keypair"
  public_key = var.ssh_public_key

  tags = {
    Name        = "${var.project_name}-${var.environment}-keypair"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Instance EC2 pour le backend
resource "aws_instance" "backend" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  subnet_id              = var.subnet_id
  vpc_security_group_ids = [var.security_group_id]
  key_name               = aws_key_pair.main.key_name
  iam_instance_profile   = var.iam_instance_profile_name

  # User data pour installer Docker et démarrer l'application
  user_data = <<-EOF
              #!/bin/bash
              # Mise à jour du système
              yum update -y
              
              # Installation de Docker
              yum install -y docker
              systemctl start docker
              systemctl enable docker
              
              # Installation de Docker Compose
              curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
              chmod +x /usr/local/bin/docker-compose
              
              # Installation de git
              yum install -y git
              
              # Clonage du repository (à remplacer par ton repo)
              # git clone https://github.com/ton-username/sorika.git /home/ec2-user/sorika
              
              # Pour l'instant, on suppose que l'app est déjà déployée
              # via CI/CD ou manuellement
              EOF

  tags = {
    Name        = "${var.project_name}-${var.environment}-backend"
    Environment = var.environment
    Project     = var.project_name
    Role        = "backend"
  }
}
