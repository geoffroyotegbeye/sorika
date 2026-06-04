# ============================================================================
# Data Sources Terraform - Récupération de données externes
# ============================================================================
# Ce fichier définit les data sources pour récupérer des données externes
# depuis AWS, comme les AMI IDs qui changent selon la région.
#
# Pourquoi utiliser des data sources ?
# - Les AMI IDs changent selon la région AWS
# - Les AMI IDs changent avec le temps (nouvelles versions)
# - Évite de mettre des valeurs en dur qui cassent en prod
#
# Documentation : https://www.terraform.io/docs/language/data-sources/index.html
# ============================================================================

# ----------------------------------------------------------------------------
# Data Source pour Amazon Linux 2023 AMI
# ----------------------------------------------------------------------------
# Récupère dynamiquement la dernière AMI Amazon Linux 2023
# Fonctionne dans n'importe quelle région AWS
# ----------------------------------------------------------------------------

data "aws_ami" "amazon_linux" {
  most_recent = true
  # Récupère l'AMI la plus récente

  owners = ["amazon"]
  # Propriétaire de l'AMI = Amazon
  # Garantit que c'est une AMI officielle Amazon

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
    # Filtre pour Amazon Linux 2023 (al2023-ami)
    # * = wildcard pour la version
    # x86_64 = architecture 64-bit
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
    # Virtualization type = HVM (Hardware Virtual Machine)
    # Requis pour la plupart des instances modernes
  }
}

# ============================================================================
# Utilisation de ce data source
# ============================================================================
#
# Dans modules/compute/main.tf, remplacer :
#   ami = var.ami_id
# par :
#   ami = data.aws_ami.amazon_linux.id
#
# Dans main.tf, passer l'AMI ID au module compute :
#   ami_id = data.aws_ami.amazon_linux.id
#
# Dans variables.tf et modules/compute/variables.tf, supprimer la variable ami_id
# ============================================================================
