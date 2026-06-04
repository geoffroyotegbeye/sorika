# Guide de Déploiement sur AWS Free Tier

Ce guide couvre la mise en production de Sorika sur AWS Free Tier.

## Prérequis

- Compte AWS avec Free Tier activé (12 mois)
- AWS CLI installé et configuré
- Terraform installé
- Docker installé
- Clé SSH générée

## Étape 1 : Préparer l'infrastructure

```bash
cd infra/terraform

# Configurer les credentials AWS
aws configure

# Copier et remplir terraform.tfvars
cp terraform.tfvars.example terraform.tfvars
# Éditer avec ta clé SSH et mot de passe RDS
```

Contenu de `terraform.tfvars` :
```hcl
aws_region = "us-east-1"
project_name = "sorika"
environment = "dev"
ssh_public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQC..."
db_password = "votre-mot-de-passe-secu-pour-rds"
```

## Étape 2 : Déployer l'infrastructure

```bash
# Initialiser Terraform
terraform init

# Voir le plan
terraform plan

# Appliquer
terraform apply
```

Après `terraform apply`, note les outputs :
- `ec2_public_ip` : IP de l'instance EC2
- `rds_endpoint` : Endpoint de la base de données
- `s3_bucket_name` : Nom du bucket S3

## Étape 3 : Configurer les secrets GitHub

Aller dans ton repository GitHub : `Settings` → `Secrets and variables` → `Actions`

Ajouter les secrets :
- `AWS_ACCESS_KEY_ID` : Clé d'accès AWS pour CI/CD
- `AWS_SECRET_ACCESS_KEY` : Clé secrète AWS pour CI/CD
- `EC2_PUBLIC_IP` : IP de l'instance EC2 (output Terraform)
- `EC2_SSH_KEY` : Contenu de ta clé privée SSH
- `DATABASE_URL` : `postgresql://sorika:PASSWORD@RDS_ENDPOINT:5432/sorika?schema=public`
- `JWT_SECRET` : Secret JWT sécurisé
- `AWS_REGION` : `us-east-1`
- `S3_BUCKET_NAME` : Nom du bucket S3 (output Terraform)
- `FRONTEND_URL` : URL de ton frontend (ex: `https://sorika.vercel.app`)

## Étape 4 : Créer le repository ECR

```bash
# Créer le repository ECR
aws ecr create-repository --repository-name sorika-backend --region us-east-1
```

## Étape 5 : Configurer AWS Budgets (IMPORTANT)

Pour éviter les factures surprises :

```bash
# Créer un budget à 5€
aws budgets create-budget \
  --account-id $(aws sts get-caller-identity --query Account --output text) \
  --budget file://budget.json
```

Fichier `budget.json` :
```json
{
  "BudgetName": "sorika-monthly-budget",
  "BudgetLimit": {
    "Amount": "5",
    "Unit": "USD"
  },
  "TimeUnit": "MONTHLY",
  "BudgetType": "COST",
  "NotificationWithSubscribers": [
    {
      "Notification": {
        "NotificationType": "ACTUAL",
        "ComparisonOperator": "GREATER_THAN",
        "Threshold": 80
      },
      "Subscribers": [
        {
          "SubscriptionType": "EMAIL",
          "Address": "ton-email@example.com"
        }
      ]
    }
  ]
}
```

## Étape 6 : Déployer manuellement (test)

Avant d'activer le CI/CD, teste le déploiement manuel :

```bash
# Build l'image Docker
cd backend
docker build -t sorika-backend:latest -f ../infra/docker/Dockerfile.backend .

# Login à ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com

# Tag l'image
docker tag sorika-backend:latest $(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com/sorika-backend:latest

# Push l'image
docker push $(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com/sorika-backend:latest

# SSH sur l'instance EC2
ssh -i sorika_key ec2-user@EC2_PUBLIC_IP

# Sur l'instance EC2
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com
docker pull $(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com/sorika-backend:latest
docker run -d --name sorika-backend -p 3001:3001 \
  -e DATABASE_URL="postgresql://sorika:PASSWORD@RDS_ENDPOINT:5432/sorika?schema=public" \
  -e JWT_SECRET="votre-secret" \
  -e AWS_REGION="us-east-1" \
  -e AWS_ACCESS_KEY_ID="KEY" \
  -e AWS_SECRET_ACCESS_KEY="SECRET" \
  -e S3_BUCKET_NAME="sorika-dev-uploads" \
  -e FRONTEND_URL="http://localhost:3000" \
  $(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com/sorika-backend:latest
```

## Étape 7 : Déployer le frontend

Option 1 : AWS Amplify (recommandé pour Next.js)
1. Connecte ton repo GitHub sur AWS Amplify
2. Configure les variables d'environnement
3. Déploie automatiquement à chaque push

Option 2 : Amplify CLI (manuel)
```bash
# Installer Amplify CLI
npm install -g @aws-amplify/cli

# Initialiser
amplify init
amplify add hosting
amplify publish
```

## Étape 8 : Configurer HTTPS (optionnel)

Pour un vrai domaine :

1. Acheter un domaine sur Route 53
2. Créer un certificat ACM
3. Configurer CloudFront ou Load Balancer
4. Configurer les records DNS

## Étape 9 : Monitoring avec CloudWatch

```bash
# Créer un log group pour l'application
aws logs create-log-group --log-group-name /sorika/backend --region us-east-1

# Configurer l'instance EC2 pour envoyer les logs
# (via CloudWatch Agent)
```

## Étape 10 : Test complet

1. Créer un compte sur l'application
2. Créer une entreprise
3. Tester les modules (RH, CRM, etc.)
4. Tester l'upload de fichiers (S3)
5. Vérifier les logs CloudWatch

## Étape 11 : Nettoyage (IMPORTANT)

Une fois le test terminé, détruis l'infra pour ne pas payer :

```bash
cd infra/terraform
terraform destroy
```

Cela détruira :
- Instance EC2
- Instance RDS
- Bucket S3
- VPC et subnets
- Security groups
- IAM roles

## Architecture finale

```
┌─────────────────────────────────────────┐
│  Frontend (AWS Amplify)                │
│  https://sorika.amplifyapp.com         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  EC2 t3.micro (Backend NestJS)          │
│  - Docker + conteneur backend           │
│  - IAM Role (accès S3)                  │
│  - Security Group (ports 3001, 22)     │
│  - IP: EC2_PUBLIC_IP                    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  RDS db.t3.micro (PostgreSQL)           │
│  - Subnet privé                          │
│  - Security Group (port 5432)           │
│  - Endpoint: RDS_ENDPOINT               │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  S3 Bucket (sorika-dev-uploads)         │
│  - Blocage accès public                 │
│  - Versioning activé                     │
│  - Lifecycle Glacier                    │
└─────────────────────────────────────────┘
```

## Coûts estimés (Free Tier)

| Service | Usage | Coût |
|---------|-------|------|
| EC2 t3.micro | 750h/mois | **GRATUIT** (12 mois) |
| RDS db.t3.micro | 750h/mois + 20 GB | **GRATUIT** (12 mois) |
| S3 | 5 GB + 20k requêtes | **GRATUIT** |
| Data Transfer | 100 GB/mois | **GRATUIT** |
| **Total** | | **0€** (12 mois) |

Après 12 mois Free Tier :
- EC2 t3.micro : ~$15/mois
- RDS db.t3.micro : ~$15/mois
- S3 : ~$0.023/GB
- **Total estimé** : ~$30-35/mois

## Sécurité

- ✅ MFA activé sur le compte AWS
- ✅ RDS dans subnet privé (pas d'accès direct internet)
- ✅ Security groups restrictifs
- ✅ IAM roles au lieu de clés d'accès
- ✅ S3 avec blocage accès public
- ✅ Secrets jamais commités
- ✅ Budget AWS configuré

## Prochaines améliorations

- [ ] Ajouter un Load Balancer pour la scalabilité
- [ ] Configurer Auto Scaling Group
- [ ] Ajouter CloudFront pour le CDN
- [ ] Configurer Route 53 pour le DNS
- [ ] Ajouter des tests automatisés dans le CI/CD
- [ ] Configurer des backups cross-region
- [ ] Ajouter un WAF (Web Application Firewall)
