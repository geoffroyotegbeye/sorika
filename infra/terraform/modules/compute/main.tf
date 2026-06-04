# ============================================================================
# Module Compute - Instance EC2 pour le Backend
# ============================================================================
# Ce module crée une instance EC2 qui héberge le backend NestJS.
#
# Pourquoi EC2 ?
# - Contrôle total : Docker, configuration personnalisée
# - Coût prévisible : Free Tier 12 mois (t3.micro)
# - Adapté pour un backend API avec dépendances lourdes
#
# Alternatives non choisies :
# - Lambda : limité en temps d'exécution, moins adapté pour API longue
# - ECS/Fargate : plus complexe, plus cher pour un simple backend
#
# Documentation AWS : https://docs.aws.amazon.com/ec2/
# ============================================================================

# ----------------------------------------------------------------------------
# Key Pair SSH
# ----------------------------------------------------------------------------
# Permet l'accès SSH à l'instance EC2 pour l'administration
# ----------------------------------------------------------------------------

resource "aws_key_pair" "main" {
  key_name   = "${var.project_name}-${var.environment}-keypair"
  # Exemple : sorika-dev-keypair
  # Nom unique pour la clé dans la région AWS

  public_key = file("~/.ssh/sorika.pub")
  # Clé publique SSH lue depuis le fichier local
  # Générée avec : ssh-keygen -t rsa -f ~/.ssh/sorika
  # Le fichier .pub contient la clé publique (non sensible)
  # Voir infra/DEPLOYMENT_GUIDE.md pour la génération de la clé

  tags = {
    Name        = "${var.project_name}-${var.environment}-keypair"
    Environment = var.environment
    Project     = var.project_name
  }
}

# ----------------------------------------------------------------------------
# Instance EC2 pour le Backend NestJS
# ----------------------------------------------------------------------------
# Instance virtuelle qui exécute le backend dans un conteneur Docker
# ----------------------------------------------------------------------------

resource "aws_instance" "backend" {
  ami                    = var.ami_id
  # AMI ID = Amazon Machine Image (image système)
  # Défini dans variables.tf du module parent
  # Exemple : ami-0c7217cdde317cfec (Amazon Linux 2023, us-east-1)
  # Note : L'AMI ID change selon la région
  # Voir : https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html

  instance_type          = var.instance_type
  # Type d'instance = taille CPU/RAM
  # Défini dans variables.tf du module parent
  # t3.micro = 1 vCPU, 1 GB RAM (Free Tier eligible)
  # Voir : https://aws.amazon.com/ec2/instance-types/

  subnet_id              = var.subnet_id
  # ID du subnet où placer l'instance
  # Passé depuis module.network.public_subnet_id
  # L'instance sera dans le subnet public (accessible depuis internet)

  vpc_security_group_ids = [var.security_group_id]
  # Security group attaché à l'instance (pare-feu)
  # Passé depuis module.network.backend_security_group_id
  # Ports ouverts : 3001 (API), 22 (SSH)

  key_name               = aws_key_pair.main.key_name
  # Key pair SSH pour l'accès administrateur
  # Utilisé pour : ssh -i sorika_key.pem ec2-user@<IP>

  iam_instance_profile   = var.iam_instance_profile_name
  # Instance profile IAM = attache un rôle IAM à l'instance
  # Passé depuis module.iam.instance_profile_name
  # Permet à EC2 d'accéder à S3 sans clés d'accès
  # Voir modules/iam/main.tf pour la configuration IAM

  # User Data = script exécuté au premier démarrage de l'instance
  # Equivalent à cloud-init
  user_data = <<-EOF
              #!/bin/bash
              # User data script exécuté au démarrage
              # Ce script installe Docker et prépare l'instance

              # Mise à jour du système
              yum update -y
              # Met à jour les paquets système pour la sécurité

              # Installation de Docker
              yum install -y docker
              systemctl start docker
              systemctl enable docker
              # Installe et démarre le service Docker
              # Docker sera utilisé pour exécuter le conteneur backend

              # Installation de Docker Compose
              curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
              chmod +x /usr/local/bin/docker-compose
              # Installe Docker Compose pour l'orchestration de conteneurs
              # Non utilisé actuellement mais disponible pour les tests

              # Installation de git
              yum install -y git
              # Installe Git pour cloner le repository si nécessaire

              # Clonage du repository (à remplacer par ton repo)
              # git clone https://github.com/ton-username/sorika.git /home/ec2-user/sorika
              # Commenté car le déploiement se fait via CI/CD (GitHub Actions)
              # Le CI/CD pull l'image Docker depuis ECR et la lance

              # Pour l'instant, on suppose que l'app est déjà déployée
              # via CI/CD ou manuellement
              EOF

  tags = {
    Name        = "${var.project_name}-${var.environment}-backend"
    # Exemple : sorika-dev-backend
    Environment = var.environment
    Project     = var.project_name
    Role        = "backend"
    # Tag Role pour identifier le type d'instance
  }
}

# ============================================================================
# Références entre modules
# ============================================================================
#
# Variables d'entrée passées depuis main.tf :
# - subnet_id : module.network.public_subnet_id
# - security_group_id : module.network.backend_security_group_id
# - iam_instance_profile_name : module.iam.instance_profile_name
#
# Outputs de ce module utilisés dans main.tf :
# - instance_id : Référence générale
# - public_ip : Utilisé dans GitHub Secret EC2_PUBLIC_IP
# - private_ip : Communication interne avec RDS
#
# Voir outputs.tf pour la liste complète des outputs
# Voir infra/GITHUB_SECRETS.md pour la configuration des secrets GitHub
# ============================================================================
