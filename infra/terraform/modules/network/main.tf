# ============================================================================
# Module Network - Infrastructure Réseau AWS
# ============================================================================
# Ce module crée toute l'infrastructure réseau nécessaire :
# - VPC (réseau privé virtuel)
# - Subnets (public et privé)
# - Internet Gateway (accès internet)
# - Route Tables (routage)
# - Security Groups (pare-feu)
#
# Pourquoi cette architecture ?
# - Defense in Depth : Séparation subnet public/privé
# - RDS dans subnet privé = pas d'accès direct internet (sécurité)
# - EC2 dans subnet public = accessible pour l'API
#
# Documentation AWS : https://docs.aws.amazon.com/vpc/
# ============================================================================

# ----------------------------------------------------------------------------
# VPC (Virtual Private Cloud)
# ----------------------------------------------------------------------------
# Réseau privé virtuel isolé dans AWS
# Équivalent à un réseau local dans un datacenter
# ----------------------------------------------------------------------------

resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  # CIDR block : 10.0.0.0/16 = 65,536 adresses IP disponibles
  # Permet de créer ~256 subnets de /24
  # Voir variables.tf pour la valeur par défaut

  enable_dns_hostnames = true
  # Active la résolution DNS dans le VPC
  # Permet aux instances d'avoir des noms d'hôte DNS

  enable_dns_support   = true
  # Active le support DNS fourni par AWS
  # Nécessaire pour la résolution DNS des services AWS

  tags = {
    Name        = "${var.project_name}-${var.environment}-vpc"
    # Exemple : sorika-dev-vpc
    Environment = var.environment
    Project     = var.project_name
  }
  # Tags pour l'organisation et la facturation
}

# ----------------------------------------------------------------------------
# Internet Gateway (IGW)
# ----------------------------------------------------------------------------
# Permet au subnet public d'accéder à internet
# Équivalent à un routeur vers internet
# ----------------------------------------------------------------------------

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  # Attaché au VPC créé ci-dessus

  tags = {
    Name        = "${var.project_name}-${var.environment}-igw"
    Environment = var.environment
    Project     = var.project_name
  }
  # Une seule IGW par VPC
}

# ----------------------------------------------------------------------------
# Subnet Public
# ----------------------------------------------------------------------------
# Accessible depuis internet via l'Internet Gateway
# Héberge l'instance EC2 (backend)
# ----------------------------------------------------------------------------

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidr
  # CIDR : 10.0.1.0/24 = 256 adresses IP
  # Voir variables.tf

  map_public_ip_on_launch = true
  # IMPORTANT : Attribue automatiquement une IP publique aux instances
  # Nécessaire pour que EC2 soit accessible depuis internet

  availability_zone       = "${var.aws_region}a"
  # Zone de disponibilité (datacenter physique)
  # Pour la prod, utiliser plusieurs AZs pour la haute disponibilité

  tags = {
    Name        = "${var.project_name}-${var.environment}-public-subnet"
    Environment = var.environment
    Project     = var.project_name
    Type        = "public"
  }
}

# ----------------------------------------------------------------------------
# Subnet Privé
# ----------------------------------------------------------------------------
# Isolé d'internet (pas d'accès direct)
# Héberge l'instance RDS (base de données)
# Plus sécurisé car pas accessible depuis internet
# ----------------------------------------------------------------------------

resource "aws_subnet" "private" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_cidr
  # CIDR : 10.0.2.0/24 = 256 adresses IP
  # Voir variables.tf

  availability_zone = "${var.aws_region}a"
  # Même AZ que le subnet public pour minimiser la latence
  # EC2 peut communiquer avec RDS dans la même AZ

  tags = {
    Name        = "${var.project_name}-${var.environment}-private-subnet"
    Environment = var.environment
    Project     = var.project_name
    Type        = "private"
  }
}

# ----------------------------------------------------------------------------
# Route Table pour le Subnet Public
# ----------------------------------------------------------------------------
# Définit comment le trafic sort du subnet public
# Route tout le trafic vers l'Internet Gateway
# ----------------------------------------------------------------------------

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    # 0.0.0.0/0 = tout le trafic internet
    gateway_id = aws_internet_gateway.main.id
    # Route vers l'Internet Gateway
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-public-rt"
    Environment = var.environment
    Project     = var.project_name
  }
}

# ----------------------------------------------------------------------------
# Association Route Table ↔ Subnet Public
# ----------------------------------------------------------------------------
# Attache la route table au subnet public
# Sans cette association, le subnet ne sait pas comment router le trafic
# ----------------------------------------------------------------------------

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# ----------------------------------------------------------------------------
# Security Group Backend (EC2)
# ----------------------------------------------------------------------------
# Pare-feu virtuel pour l'instance EC2
# Contrôle le trafic entrant et sortant
# ----------------------------------------------------------------------------

resource "aws_security_group" "backend" {
  name        = "${var.project_name}-${var.environment}-backend-sg"
  description = "Security group pour le backend NestJS"
  vpc_id      = aws_vpc.main.id

  # Règles ingress (trafic entrant)
  # HTTP (port 3001 pour l'API NestJS)
  ingress {
    from_port   = 3001
    to_port     = 3001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    # 0.0.0.0/0 = autorisé depuis n'importe où (internet)
    # Pour la prod, restreindre à des IPs spécifiques ou un VPN
  }

  # SSH (port 22) pour l'accès administrateur
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    # Pour la prod, restreindre à ton IP ou un VPN
    # Voir infra/GITHUB_SECRETS.md pour la clé SSH
  }

  # Règle egress (trafic sortant)
  # Tout le trafic sortant autorisé
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    # -1 = tous les protocoles
    cidr_blocks = ["0.0.0.0/0"]
    # Nécessaire pour que EC2 puisse accéder à S3, RDS, internet
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-backend-sg"
    Environment = var.environment
    Project     = var.project_name
  }
}

# ----------------------------------------------------------------------------
# Security Group RDS (PostgreSQL)
# ----------------------------------------------------------------------------
# Pare-feu virtuel pour l'instance RDS
# Plus restrictif que le backend SG (sécurité)
# ----------------------------------------------------------------------------

resource "aws_security_group" "rds" {
  name        = "${var.project_name}-${var.environment}-rds-sg"
  description = "Security group pour RDS PostgreSQL"
  vpc_id      = aws_vpc.main.id

  # Règle ingress (trafic entrant)
  # PostgreSQL (port 5432) uniquement depuis le backend SG
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.backend.id]
    # IMPORTANT : security_groups au lieu de cidr_blocks
    # Seul le backend SG peut se connecter à RDS
    # Pas d'accès direct depuis internet (sécurité)
  }

  # Règle egress (trafic sortant)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    # RDS peut initier des connexions sortantes (backups, logs)
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-rds-sg"
    Environment = var.environment
    Project     = var.project_name
  }
}

# ============================================================================
# Références entre modules
# ============================================================================
#
# Outputs de ce module utilisés dans main.tf :
# - vpc_id : Référence générale
# - public_subnet_id : Utilisé par module.compute
# - private_subnet_id : Utilisé par module.database
# - backend_security_group_id : Utilisé par module.compute
# - rds_security_group_id : Utilisé par module.database
#
# Voir outputs.tf pour la liste complète des outputs
# ============================================================================
