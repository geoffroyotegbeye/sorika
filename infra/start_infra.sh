cd infra/terraform

# 1. Configurer les credentials AWS
aws configure

# 2. Copier et remplir terraform.tfvars
cp terraform.tfvars.example terraform.tfvars
# Éditer avec ta clé SSH et mot de passe RDS

# 3. Initialiser
terraform init

# 4. Voir le plan
terraform plan

# 5. Appliquer
terraform apply

# 6. Détruire (pour arrêter de payer)
terraform destroy