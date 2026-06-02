# Sorika - Roadmap Cloud & DevSecOps

> **Objectif** : Transformer `sorika` en une application cloud-native sur AWS Free Tier, en apprenant les fondamentaux du Cloud, DevSecOps et de l'architecture moderne.

---

## 📋 Vue d'ensemble du parcours

```
Étape 0 : Roadmap (CE DOCUMENT)                    ← TU ES ICI
Étape 1 : Docker local (conteneurisation)
Étape 2 : Cloud-ready (corrections code)
Étape 3 : Terraform réseau (VPC, subnets, security groups)
Étape 4 : Terraform ressources (EC2, RDS, S3)
Étape 5 : CI/CD (GitHub Actions)
Étape 6 : Déploiement AWS Free Tier
```

---

## 🎯 Pourquoi cet ordre ?

| Étape | Concept clé | Pourquoi ici ? |
|-------|-------------|----------------|
| 0 | **Vision globale** | Avant de coder, on comprend la carte. Sans ça, on navigue à l'aveugle. |
| 1 | **Conteneurisation** | Le concept fondamental du cloud moderne. On l'apprend GRATUITEMENT en local. |
| 2 | **Cloud-ready** | On corrige le code pour qu'il fonctionne dans le cloud (uploads sur disque = mauvais). |
| 3 | **Réseau (VPC)** | La base de toute archi AWS. On comprend isoler, sécuriser, segmenter. |
| 4 | **Ressources managées** | RDS, S3, EC2 — les briques que les pros utilisent. |
| 5 | **CI/CD** | Automatisation — on ne déploie plus à la main. |
| 6 | **Déploiement réel** | Le couronnement : tout mettre en ligne sur AWS Free Tier. |

---

## 📌 Checklist de progression

- [ ] **Étape 0** — Comprendre la roadmap ✅
- [ ] **Étape 1** — Dockeriser l'app en local
- [ ] **Étape 2** — Rendre l'app cloud-ready
- [ ] **Étape 3** — Terraform réseau (VPC)
- [ ] **Étape 4** — Terraform ressources (EC2, RDS, S3)
- [ ] **Étape 5** — CI/CD GitHub Actions
- [ ] **Étape 6** — Déploiement sur AWS Free Tier

---

## 📚 Étape 0 — Roadmap (document de référence)

**Durée estimée** : 15 min (lecture)
**Objectif** : Avoir une vision claire de tout le parcours

**Ce que tu dois comprendre maintenant :**

1. **Ton projet actuel** (`sorika_erp`) est un SaaS multi-tenant complet avec 18 modules métier
2. **Le cloud moderne repose sur les conteneurs** — c'est le concept clé à maîtriser
3. **AWS Free Tier = 12 mois gratuits** mais avec des limites (1 GB RAM par instance, 20 GB RDS, 5 GB S3)
4. **L'infrastructure as code (Terraform)** = décrire ton cloud dans des fichiers texte (reproductible, versionnable)
5. **La séparation app/infra** = bonne pratique (ton code dans `backend/` et `frontend/`, ton infra dans `infra/`)

**Questions à se poser après cette étape :**
- Pourquoi ne pas tout mettre sur une seule machine AWS ?
- Pourquoi les uploads sur disque local sont-ils un problème dans le cloud ?
- Qu'est-ce que le "moindre privilège" en sécurité ?

---

## 🐳 Étape 1 — Dockeriser l'app en local

**Durée estimée** : 2-3 heures
**Objectif** : Faire tourner toute la stack (backend + frontend + postgres) en conteneurs sur ta machine

**Concepts à apprendre :**
- Qu'est-ce qu'un conteneur Docker ?
- Qu'est-ce qu'un Dockerfile ?
- Qu'est-ce que docker-compose ?
- Pourquoi les conteneurs sont-ils révolutionnaires pour le déploiement ?

**Tâches :**
- [ ] Créer `Dockerfile` pour le backend (NestJS)
- [ ] Créer `Dockerfile` pour le frontend (Next.js)
- [ ] Créer `docker-compose.yml` qui orchestre tout (backend + frontend + postgres)
- [ ] Tester localement : `docker-compose up`
- [ ] Comprendre les volumes (persistance des données postgres)
- [ ] Comprendre les réseaux (communication entre conteneurs)

**Livrables :**
- `infra/docker/Dockerfile.backend`
- `infra/docker/Dockerfile.frontend`
- `infra/docker/docker-compose.yml`

**Pourquoi c'est crucial :**
- Si tu ne maîtrises pas Docker en local, tu ne comprendras pas ECS/Fargate sur AWS
- C'est gratuit, sans risque, et tu peux tout casser sans conséquence
- C'est la base du cloud moderne

---

## 🔧 Étape 2 — Rendre l'app cloud-ready

**Durée estimée** : 2-3 heures
**Objectif** : Corriger le code de `sorika` pour qu'il fonctionne correctement dans le cloud

**Problèmes identifiés dans le code actuel :**

### Problème 1 : Uploads sur disque local
**Fichier** : `backend/src/main.ts:20-22`
```typescript
app.useStaticAssets(join(process.cwd(), 'uploads'), {
  prefix: '/uploads',
});
```
**Pourquoi c'est un problème :**
- Sur le cloud, le disque d'une instance EC2 est **éphémère** (perdu à chaque redéploiement)
- Si tu scales (plusieurs instances), les fichiers ne sont pas partagés
- Pas de backup automatique

**Solution :** Migrer vers AWS S3 (stockage objet managé, infini, avec backups)
- Ajouter un module AWS SDK dans le backend
- Configurer un bucket S3
- Stocker les fichiers sur S3 au lieu du disque local
- Servir les fichiers via une URL S3 ou CloudFront

### Problème 2 : CORS en dur sur localhost
**Fichier** : `backend/src/main.ts:25-28`
```typescript
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
});
```
**Pourquoi c'est un problème :**
- En production, ton frontend aura un vrai domaine (ex: sorika.app)
- Le CORS bloquera les requêtes

**Solution :** Rendre configurable via variable d'environnement
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});
```

**Tâches :**
- [ ] Installer `@aws-sdk/client-s3` dans le backend
- [ ] Créer un service S3 pour gérer les uploads
- [ ] Modifier le contrôleur média pour utiliser S3
- [ ] Corriger le CORS pour être configurable
- [ ] Ajouter les variables d'environnement nécessaires (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET_NAME, etc.)
- [ ] Tester localement avec un bucket S3 de test

**Livrables :**
- Code backend modifié pour S3
- CORS configurable
- `.env.example` mis à jour avec les nouvelles variables

**Pourquoi c'est crucial :**
- Une app qui n'est pas cloud-ready échouera en production
- Tu apprends à penser "cloud-native" (pas de stockage local, configuration externalisée)

---

## 🌐 Étape 3 — Terraform réseau (VPC)

**Durée estimée** : 3-4 heures
**Objectif** : Créer le réseau AWS qui hébergera ton application

**Concepts à apprendre :**
- Qu'est-ce qu'un VPC (Virtual Private Cloud) ?
- Qu'est-ce qu'un subnet (public vs privé) ?
- Qu'est-ce qu'un Security Group (firewall au niveau instance) ?
- Qu'est-ce qu'un NAT Gateway (et pourquoi ça coûte cher) ?
- Qu'est-ce qu'une route table ?

**Architecture cible :**
```
VPC (10.0.0.0/16)
├── Subnet public (10.0.1.0/24)
│   └── EC2 (backend NestJS)
│   └── Internet Gateway
└── Subnet privé (10.0.2.0/24)
    └── RDS PostgreSQL
```

**Pourquoi cette architecture ?**
- **Subnet public** : accessible depuis internet (pour ton backend API)
- **Subnet privé** : pas d'accès direct internet (pour ta base de données = plus sécurisé)
- **Security Groups** : contrôle fin du trafic (qui peut parler à qui)

**Tâches :**
- [ ] Installer Terraform
- [ ] Créer `infra/terraform/main.tf` (provider AWS)
- [ ] Créer le module réseau (`infra/terraform/modules/network/`)
- [ ] Définir le VPC, subnets, internet gateway, route tables
- [ ] Définir les security groups (backend SG, RDS SG)
- [ ] Tester avec `terraform plan` et `terraform apply`
- [ ] Comprendre l'état Terraform (`terraform state`)

**Livrables :**
- `infra/terraform/modules/network/main.tf`
- `infra/terraform/main.tf` (qui appelle le module)
- Réseau créé dans ton compte AWS (visible dans la console)

**Pourquoi c'est crucial :**
- Le réseau est la fondation de toute archi cloud
- Tu apprends la segmentation et la sécurité (principe du moindre privilège)
- C'est une compétence DevSecOps de base

---

## 🏗️ Étape 4 — Terraform ressources (EC2, RDS, S3)

**Durée estimée** : 4-5 heures
**Objectif** : Créer les ressources qui hébergeront ton application

**Concepts à apprendre :**
- EC2 (Elastic Compute Cloud) = serveur virtuel
- RDS (Relational Database Service) = base managée
- S3 (Simple Storage Service) = stockage objet
- IAM roles = identité pour les services AWS
- Key pairs = SSH pour se connecter aux instances

**Architecture cible :**
```
EC2 t3.micro (1 vCPU, 1 GB RAM)
├── Docker installé
├── Backend NestJS (conteneur)
└── Frontend Next.js (déployé sur Amplify ou Vercel)

RDS db.t3.micro (PostgreSQL)
├── Base de données managée
├── Backups automatiques
└── Accessible uniquement depuis le subnet privé

S3 Bucket
├── Stockage des uploads
└── Configuré avec lifecycle rules (transition vers Glacier)
```

**Tâches :**
- [ ] Créer le module compute (`infra/terraform/modules/compute/`)
  - Définir l'instance EC2
  - Attacher le security group
  - Attacher un rôle IAM (pour accéder à S3)
- [ ] Créer le module database (`infra/terraform/modules/database/`)
  - Définir l'instance RDS
  - Configurer le subnet group
  - Configurer les paramètres (storage, engine version)
- [ ] Créer le module storage (`infra/terraform/modules/storage/`)
  - Définir le bucket S3
  - Configurer le blocage d'accès public
  - Configurer la politique de cycle de vie
- [ ] Créer le module IAM (`infra/terraform/modules/iam/`)
  - Définir le rôle pour EC2
  - Définir la politique pour accéder à S3
- [ ] Tout orchestrer dans `main.tf`
- [ ] Tester avec `terraform apply`
- [ ] Vérifier dans la console AWS

**Livrables :**
- Modules Terraform complets
- Infra créée dans AWS
- Compréhension de la liaison entre les ressources (EC2 → RDS via SG, EC2 → S3 via IAM)

**Pourquoi c'est crucial :**
- Tu apprends à utiliser les services managés AWS (ce que font les pros)
- Tu comprends comment les ressources se connectent entre elles
- Tu as une infra reproductible (un `terraform destroy` + `apply` et c'est refait)

---

## 🚀 Étape 5 — CI/CD (GitHub Actions)

**Durée estimée** : 3-4 heures
**Objectif** : Automatiser le déploiement de ton application

**Concepts à apprendre :**
- Qu'est-ce que CI/CD (Continuous Integration / Continuous Deployment) ?
- Comment fonctionne GitHub Actions ?
- Comment connecter GitHub Actions à AWS ?
- Comment sécuriser les secrets (AWS credentials) ?

**Pipeline cible :**
```
Push sur main
    ↓
GitHub Actions se déclenche
    ↓
Build du backend (Docker)
    ↓
Push de l'image Docker sur ECR (Elastic Container Registry)
    ↓
Déploiement sur EC2 (via SSH ou ECS)
    ↓
Build du frontend
    ↓
Déploiement sur Amplify ou Vercel
```

**Tâches :**
- [ ] Créer un repository ECR pour les images Docker
- [ ] Créer le workflow GitHub Actions (`.github/workflows/deploy.yml`)
- [ ] Configurer les secrets GitHub (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
- [ ] Écrire le job de build backend (Docker build + push ECR)
- [ ] Écrire le job de déploiement backend (SSH sur EC2 + docker pull)
- [ ] Écrire le job de build frontend (Next.js build)
- [ ] Configurer le déploiement frontend (Amplify ou Vercel)
- [ ] Tester le pipeline en faisant un push

**Livrables :**
- Workflow GitHub Actions fonctionnel
- Déploiement automatique à chaque push
- Compréhension de la chaîne d'outils CI/CD

**Pourquoi c'est crucial :**
- Les pros ne déploient jamais à la main
- Tu apprends l'automatisation (compétence DevOps clé)
- Tu gagnes du temps et réduis les erreurs humaines

---

## ☁️ Étape 6 — Déploiement sur AWS Free Tier

**Durée estimée** : 2-3 heures
**Objectif** : Mettre ton application en ligne et accessible

**Concepts à apprendre :**
- Comment accéder à ton application (URL, DNS)
- Comment monitorer (CloudWatch)
- Comment gérer les coûts (AWS Budgets)
- Comment sécuriser en production (HTTPS, secrets)

**Tâches :**
- [ ] Configurer un domaine (optionnel, via Route 53)
- [ ] Configurer HTTPS (certificat ACM)
- [ ] Configurer un Load Balancer (optionnel, pour scaler)
- [ ] Configurer AWS Budgets (alerte à 5€)
- [ ] Configurer CloudWatch (logs et métriques)
- [ ] Faire un test complet (créer un compte, créer une entreprise, tester les modules)
- [ ] Documenter l'architecture finale
- [ ] Faire un `terraform destroy` pour ne pas payer après le test

**Livrables :**
- Application en ligne et fonctionnelle
- Documentation de l'architecture
- Compréhension du cycle de vie complet (dev → prod)

**Pourquoi c'est crucial :**
- C'est le couronnement de tout ton apprentissage
- Tu as une application réelle en production
- Tu peux montrer ça dans ton portfolio

---

## 🎓 Compétences acquises à la fin

À la fin de ce parcours, tu maîtriseras :

- **Docker** : conteneurisation, images, volumes, réseaux
- **AWS** : EC2, RDS, S3, VPC, Security Groups, IAM, CloudWatch
- **Terraform** : infrastructure as code, modules, état
- **CI/CD** : GitHub Actions, automatisation de déploiement
- **DevSecOps** : sécurité réseau, moindre privilège, secrets management
- **Architecture cloud** : conception d'archi scalable et sécurisée

---

## 📖 Ressources recommandées

- **Docker** : [Documentation officielle](https://docs.docker.com/)
- **AWS** : [Free Tier Guide](https://aws.amazon.com/free/)
- **Terraform** : [Tutorials](https://learn.hashicorp.com/tutorials/terraform)
- **GitHub Actions** : [Documentation](https://docs.github.com/en/actions)

---

## ⚠️ Rappels de sécurité

- **JAMAIS** commiter de secrets (AWS keys, passwords) dans le code
- **Toujours** utiliser des variables d'environnement
- **Toujours** activer MFA sur ton compte AWS
- **Toujours** utiliser des rôles IAM plutôt que des clés d'accès pour les services
- **Toujours** configurer un budget AWS pour éviter les surprises

---

## 🚀 Prêt à commencer ?

Reviens sur ce document à chaque étape pour cocher ce qui est fait.

**Prochaine étape** : Étape 1 — Dockeriser l'app en local
