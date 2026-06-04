# ============================================================================
# Module Database - Instance RDS PostgreSQL
# ============================================================================
# Ce module crée une instance RDS PostgreSQL pour la base de données.
#
# Pourquoi RDS ?
# - Managé : Backups automatiques, patching automatique
# - HA : Multi-AZ possible pour la production
# - Sécurité : Dans subnet privé, pas d'accès direct internet
#
# Alternatives non choisies :
# - PostgreSQL sur EC2 : Plus d'ops, pas de backups automatiques
# - Aurora : Plus cher, surdimensionné pour un simple ERP
#
# Documentation AWS : https://docs.aws.amazon.com/rds/
# ============================================================================

# ----------------------------------------------------------------------------
# Génération sécurisée du mot de passe RDS
# ----------------------------------------------------------------------------
# Utilise random_password pour générer un mot de passe sécurisé
# Évite de passer le mot de passe en variable sensible
# ----------------------------------------------------------------------------

resource "random_password" "db" {
  length  = 16
  # Longueur du mot de passe = 16 caractères

  special = true
  # Inclut des caractères spéciaux (!@#$%^&*)

  override_special = "_%@"
  # Caractères spéciaux autorisés (évite les caractères problématiques)
  # _ % @ sont généralement acceptés par les systèmes

  min_upper = 2
  # Minimum 2 lettres majuscules

  min_lower = 2
  # Minimum 2 lettres minuscules

  min_numeric = 2
  # Minimum 2 chiffres

  min_special = 2
  # Minimum 2 caractères spéciaux
}

# ----------------------------------------------------------------------------
# DB Subnet Group
# ----------------------------------------------------------------------------
# Groupe de subnets où RDS sera déployé
# RDS doit être dans au moins 2 subnets différentes pour la production
# Pour le dev, un seul subnet suffit
# ----------------------------------------------------------------------------

resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-${var.environment}-subnet-group"
  # Exemple : sorika-dev-subnet-group
  # Nom unique pour le subnet group dans la région AWS

  subnet_ids = [var.subnet_id]
  # ID du subnet privé où placer RDS
  # Passé depuis module.network.private_subnet_id
  # Pour la prod, utiliser plusieurs subnets dans différentes AZs

  tags = {
    Name        = "${var.project_name}-${var.environment}-subnet-group"
    Environment = var.environment
    Project     = var.project_name
  }
}

# ----------------------------------------------------------------------------
# Instance RDS PostgreSQL
# ----------------------------------------------------------------------------
# Instance de base de données managée PostgreSQL
# ----------------------------------------------------------------------------

resource "aws_db_instance" "main" {
  identifier             = "${var.project_name}-${var.environment}-db"
  # Identifiant unique de l'instance RDS
  # Exemple : sorika-dev-db
  # Utilisé pour construire l'endpoint RDS

  engine                 = "postgres"
  # Moteur de base de données : PostgreSQL
  # Alternative : mysql, mariadb, oracle, sqlserver

  engine_version         = "15.4"
  # Version de PostgreSQL
  # 15.4 = version stable avec les dernières fonctionnalités
  # Voir : https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html

  instance_class         = var.instance_class
  # Type d'instance RDS = taille CPU/RAM
  # Passé depuis variables.tf du module parent
  # db.t3.micro = 1 vCPU, 1 GB RAM, 20 GB storage (Free Tier eligible)
  # Voir : https://aws.amazon.com/rds/instance-types/

  allocated_storage      = var.allocated_storage
  # Espace disque alloué en GB
  # Passé depuis variables.tf du module parent
  # 20 GB = limite Free Tier
  # Peut être augmenté jusqu'à 64 TB pour db.t3.micro

  storage_type           = "gp2"
  # Type de stockage : gp2 (General Purpose SSD)
  # gp2 = équilibré coût/performance
  # Alternatifs : gp3 (plus performant), io1 (hautes performances)

  db_name                = var.db_name
  # Nom de la base de données initiale créée automatiquement
  # Passé depuis variables.tf du module parent
  # Exemple : sorika

  username               = var.db_username
  # Nom d'utilisateur administrateur RDS
  # Passé depuis variables.tf du module parent
  # Utilisateur avec tous les privilèges sur la base

  password               = random_password.db.result
  # Mot de passe administrateur RDS généré automatiquement
  # Utilise random_password.db.result pour un mot de passe sécurisé
  # Le mot de passe est généré localement et non stocké dans le state
  # Voir outputs.tf pour récupérer le mot de passe généré

  db_subnet_group_name   = aws_db_subnet_group.main.name
  # Subnet group où placer RDS
  # RDS sera dans le subnet privé (sécurité)

  vpc_security_group_ids = [var.security_group_id]
  # Security group attaché à RDS (pare-feu)
  # Passé depuis module.network.rds_security_group_id
  # Ports ouverts : 5432 (PostgreSQL) depuis backend_sg seulement

  # Configuration des backups et maintenance
  backup_retention_period = 7
  # Période de rétention des backups en jours
  # 7 jours = backups gardés pendant 7 jours
  # Pour la prod, augmenter à 30 jours ou plus

  backup_window          = "03:00-04:00"
  # Fenêtre de temps pour les backups automatiques (UTC)
  # 03:00-04:00 UTC = backups pendant les heures creuses
  # Format : hh24:mi-hh24:mi

  maintenance_window     = "Mon:04:00-Mon:05:00"
  # Fenêtre de maintenance pour les patchs système
  # Mon:04:00-Mon:05:00 UTC = lundi 4h-5h UTC
  # Format : ddd:hh24:mi-ddd:hh24:mi

  # Configuration de performance et accessibilité
  multi_az               = false
  # Multi-AZ = déploiement dans plusieurs zones de disponibilité
  # false = une seule AZ (moins cher, moins résilient)
  # Pour la prod, mettre à true pour la haute disponibilité

  publicly_accessible    = false
  # IMPORTANT : RDS n'est pas accessible depuis internet
  # true = accessible depuis internet (non sécurisé)
  # false = accessible seulement via VPC (sécurisé)

  skip_final_snapshot    = true
  # IMPORTANT : Pas de snapshot final lors de la destruction
  # true = pas de snapshot (économies en dev)
  # Pour la prod, mettre à false pour conserver un snapshot final

  tags = {
    Name        = "${var.project_name}-${var.environment}-rds"
    # Exemple : sorika-dev-rds
    Environment = var.environment
    Project     = var.project_name
  }
}

# ============================================================================
# Références entre modules
# ============================================================================
#
# Variables d'entrée passées depuis main.tf :
# - subnet_id : module.network.private_subnet_id
# - security_group_id : module.network.rds_security_group_id
#
# Outputs de ce module utilisés dans main.tf :
# - db_endpoint : Utilisé pour construire DATABASE_URL
# - db_port : Utilisé pour construire DATABASE_URL
#
# Voir outputs.tf pour la liste complète des outputs
# Voir infra/DEPLOYMENT_GUIDE.md pour la configuration de la connexion
# ============================================================================
