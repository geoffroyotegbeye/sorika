terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Module réseau (VPC, subnets, security groups)
module "network" {
  source = "./modules/network"

  vpc_cidr          = var.vpc_cidr
  public_subnet_cidr  = var.public_subnet_cidr
  private_subnet_cidr = var.private_subnet_cidr
  project_name      = var.project_name
  environment       = var.environment
  aws_region        = var.aws_region
}

# Module IAM (rôles et politiques)
module "iam" {
  source = "./modules/iam"

  project_name = var.project_name
  environment  = var.environment
  s3_bucket_arn = module.storage.bucket_arn

  depends_on = [module.storage]
}

# Module Storage (S3)
module "storage" {
  source = "./modules/storage"

  project_name = var.project_name
  environment  = var.environment
}

# Module Compute (EC2)
module "compute" {
  source = "./modules/compute"

  project_name           = var.project_name
  environment            = var.environment
  ami_id                 = var.ami_id
  instance_type          = var.instance_type
  subnet_id              = module.network.public_subnet_id
  security_group_id      = module.network.backend_security_group_id
  ssh_public_key         = var.ssh_public_key
  iam_instance_profile_name = module.iam.instance_profile_name

  depends_on = [module.network, module.iam]
}

# Module Database (RDS)
module "database" {
  source = "./modules/database"

  project_name       = var.project_name
  environment        = var.environment
  instance_class     = var.db_instance_class
  allocated_storage  = var.db_allocated_storage
  db_name            = var.db_name
  db_username        = var.db_username
  db_password        = var.db_password
  subnet_id          = module.network.private_subnet_id
  security_group_id  = module.network.rds_security_group_id

  depends_on = [module.network]
}
