# GitHub Secrets Configuration

Pour que le workflow CI/CD fonctionne, tu dois configurer les secrets suivants dans ton repository GitHub :

## Secrets AWS

Aller dans : `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

| Secret | Description | Comment obtenir |
|--------|-------------|----------------|
| `AWS_ACCESS_KEY_ID` | Clé d'accès AWS | Créer un utilisateur IAM avec les permissions nécessaires |
| `AWS_SECRET_ACCESS_KEY` | Clé secrète AWS | Avec l'utilisateur IAM ci-dessus |

## Secrets EC2

| Secret | Description | Comment obtenir |
|--------|-------------|----------------|
| `EC2_PUBLIC_IP` | IP publique de l'instance EC2 | Après `terraform apply`, l'IP est dans les outputs |
| `EC2_SSH_KEY` | Clé privée SSH pour l'accès EC2 | Contenu du fichier `.pem` généré avec `ssh-keygen` |

## Secrets Vercel (optionnel, pour le frontend)

| Secret | Description | Comment obtenir |
|--------|-------------|----------------|
| `VERCEL_TOKEN` | Token d'authentification Vercel | Créer un token sur vercel.com/account/tokens |
| `VERCEL_ORG_ID` | ID de l'organisation Vercel | Dans les settings du projet Vercel |
| `VERCEL_PROJECT_ID` | ID du projet Vercel | Dans les settings du projet Vercel |

## Variables d'environnement pour le backend

Ces variables doivent être configurées dans le workflow ou sur l'instance EC2 :

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | URL de connexion RDS PostgreSQL |
| `JWT_SECRET` | Secret pour signer les JWT |
| `AWS_REGION` | Région AWS (us-east-1) |
| `AWS_ACCESS_KEY_ID` | Clé d'accès AWS (pour S3) |
| `AWS_SECRET_ACCESS_KEY` | Clé secrète AWS (pour S3) |
| `S3_BUCKET_NAME` | Nom du bucket S3 |
| `FRONTEND_URL` | URL du frontend en production |

## IAM Policy recommandée pour l'utilisateur CI/CD

L'utilisateur IAM utilisé par GitHub Actions doit avoir les permissions suivantes :

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:PutImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload"
      ],
      "Resource": "*"
    }
  ]
}
```

## Note sur la clé SSH

Pour générer une clé SSH :

```bash
ssh-keygen -t rsa -b 4096 -f sorika_key
```

- `sorika_key.pub` → clé publique (à mettre dans `terraform.tfvars`)
- `sorika_key` → clé privée (à mettre dans le secret GitHub `EC2_SSH_KEY`)
