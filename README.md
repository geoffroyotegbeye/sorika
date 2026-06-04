# Sorika - ERP Multi-Tenant Cloud-Native

> **Plateforme ERP/CRM modulaire avec architecture cloud-native, conçue pour la scalabilité et la sécurité.**

---

## 🎯 Problème résolu

Les PME et startups africaines font face à un défi critique : **fragmentation des outils métier**. RH, CRM, facturation, inventaire, POS — chaque fonction utilise un outil différent, sans intégration, sans visibilité globale, avec des coûts récurrents élevés.

**Sorika** résout ce problème en offrant une **plateforme unifiée modulaire** où chaque module (RH, CRM, Finance, POS, Inventaire) communique nativement, avec une vision 360° de l'entreprise, déployée sur une infrastructure cloud moderne et sécurisée.

---

## 🏗️ Architecture d'ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                            │
│  Next.js 16 + React 19 + TypeScript + Tailwind + shadcn/ui   │
│  (SSR, Optimistic UI, Responsive Design)                     │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway Layer                          │
│  NestJS 11 + TypeScript + JWT Auth + RBAC                    │
│  (Modular Architecture, Dependency Injection)                │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   Modules    │ │   Storage    │ │   External   │
│              │ │              │ │   Services   │
│ • HR         │ │ • PostgreSQL │ │ • S3 (Media) │
│ • CRM        │ │ • Prisma ORM │ │ • ECR (Docker)│
│ • Finance   │ │              │ │              │
│ • POS        │ │              │ │              │
│ • Inventory  │ │              │ │              │
│ • Projects  │ │              │ │              │
└──────────────┘ └──────────────┘ └──────────────┘
```

---

## �️ Stack Technique & Justifications

### Frontend

| Technologie | Problème résolu | Pourquoi ce choix |
|-------------|-----------------|------------------|
| **Next.js 16** | SEO + Performance + DX | SSR pour le SEO, App Router pour l'expérience développeur, Optimistic UI pour la performance perçue |
| **React 19** | Gestion d'état complexe | Server Components pour réduire le bundle client, Concurrent Features pour la performance |
| **TypeScript** | Erreurs runtime | Typage statique pour éviter les bugs en production, meilleure maintenabilité |
| **Tailwind CSS 4** | Maintenance CSS | Utility-first pour éviter le CSS spaghetti, design system cohérent |
| **shadcn/ui** | Composants accessibles | Composants Radix UI accessibles, customizables, pas de dépendance opaque |

### Backend

| Technologie | Problème résolu | Pourquoi ce choix |
|-------------|-----------------|------------------|
| **NestJS 11** | Architecture modulaire | Structure inspirée d'Angular, Dependency Injection, Modules découplés (scalabilité) |
| **Prisma 5** | Type-safe database access | ORM moderne avec type-safety automatique, migrations gérées, excellent DX |
| **PostgreSQL 15** | Données relationnelles complexes | ACID transactions, JSON support pour flexibilité, mature et fiable |
| **JWT + RBAC** | Authentification & Autorisation | Stateless auth, permissions granulaires par module (principe du moindre privilège) |

### Infrastructure Cloud

| Technologie | Problème résolu | Pourquoi ce choix |
|-------------|-----------------|------------------|
| **AWS** | Scalabilité & Services managés | Écosystème le plus complet, services managés (RDS, S3, Amplify) = moins d'ops |
| **EC2 t3.micro** | Compute isolé | Free Tier, séparation backend/frontend, contrôle fin |
| **RDS PostgreSQL** | Base managée | Backups automatiques, patching automatique, HA multi-AZ possible |
| **S3** | Stockage objet infini | Scalabilité infinie, lifecycle rules (Glacier), blocage accès public |
| **Amplify** | Frontend managé | Supporte SSR Next.js, intégration Git, Free Tier disponible |
| **VPC + Subnets** | Sécurité réseau | Segmentation public/privé, base de données isolée (defense in depth) |
| **Terraform** | Infrastructure as Code | Reproductibilité, versionnage, drift detection |
| **Docker** | Portabilité | "Build once, run anywhere", isolation environnement |
| **GitHub Actions** | CI/CD automatisé | Déploiement automatique, tests automatisés, rollback facile |

---

## � Sécurité & DevSecOps

### Principes appliqués

1. **Defense in Depth** : Couches de sécurité (VPC, Security Groups, IAM, RBAC)
2. **Moindre Privilège** : IAM roles au lieu de clés d'accès, permissions granulaires
3. **Zero Trust** : RDS dans subnet privé, pas d'accès direct internet
4. **Secrets Management** : Jamais de secrets dans le code, variables d'environnement
5. **Immutable Infrastructure** : Terraform + Docker = infra reproductible
6. **Audit Trail** : Logs CloudWatch, traçabilité des actions

### Implémentation

- **S3** : Blocage accès public, versioning, lifecycle rules
- **RDS** : Subnet privé, security group restrictif, backups 7 jours
- **EC2** : Security groups (ports 3001, 22 uniquement), IAM role pour S3
- **IAM** : Rôles par service, policies scoped aux ressources nécessaires
- **Network** : VPC isolé, subnets public/privé, route tables contrôlées

---

## 📦 Modules Métier

Sorika adopte une architecture modulaire type Odoo, permettant d'activer/désactiver des modules selon les besoins.

| Module | Fonctionnalités clés | Intégrations |
|--------|---------------------|--------------|
| **RH** | Employés, Départements, Postes, Congés, Présences, Acomptes | ↔ Finance (paie), ↔ CRM (employés clients) |
| **CRM** | Contacts, Entreprises, Opportunités, Activités | ↔ Finance (devis/factures), ↔ HR (employés) |
| **Finance** | Devis, Factures, Paiements, Factures fournisseurs, TVA | ↔ CRM (opportunités), ↔ Inventaire (produits) |
| **POS** | Caisse, Transactions, Rapports de vente | ↔ Inventaire (stock), ↔ Finance (paiements) |
| **Inventaire** | Produits, Catégories, Mouvements de stock | ↔ POS (ventes), ↔ Finance (facturation) |
| **Projects** | Projets, Tâches, Suivi d'avancement | ↔ HR (ressources), ↔ CRM (clients) |

---

## 🚀 Déploiement

### Local (Développement)

```bash
# 1. Démarrer PostgreSQL
docker-compose up -d

# 2. Backend
cd backend
npm install
npx prisma migrate dev
npm run start:dev

# 3. Frontend
cd frontend
npm install
npm run dev
```

**Accès :**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### Cloud (Production)

Voir le guide complet dans [`infra/DEPLOYMENT_GUIDE.md`](./infra/DEPLOYMENT_GUIDE.md)

**Architecture de production :**
```
Frontend (AWS Amplify - Next.js + SSR)
    ↓ HTTPS
EC2 t3.micro (Backend NestJS + Docker)
    ↓ Private Network
RDS db.t3.micro (PostgreSQL)
    ↓
S3 Bucket (Media uploads)
```

**CI/CD :** GitHub Actions automatise le build, push ECR, déploiement EC2 et déploiement Amplify à chaque push sur `main`.

---

## 📊 Décisions Techniques & Trade-offs

### Pourquoi PostgreSQL au lieu de MongoDB ?

**Problème :** Données fortement relationnelles (employés ↔ départements ↔ postes, factures ↔ clients ↔ produits)

**Décision :** PostgreSQL

**Justification :**
- ACID transactions critiques pour la comptabilité
- Jointures complexes nécessaires pour les rapports
- JSON support pour flexibilité (permissions JSON dans Membership)
- RDS managé = backups automatiques, moins d'ops

### Pourquoi NestJS au lieu d'Express ?

**Problème :** Architecture modulaire avec 18+ modules, besoin de maintenabilité

**Décision :** NestJS

**Justification :**
- Structure modulaire native (chaque module isolé)
- Dependency Injection = testabilité
- Guards/Interceptors = auth/authorization centralisée
- Scalabilité : ajouter un module n'impacte pas les autres

### Pourquoi S3 au lieu de stockage local ?

**Problème :** Stockage local = éphémère sur EC2, pas scalable, pas de backups

**Décision :** S3

**Justification :**
- Scalabilité infinie (pas de limite de stockage)
- Durabilité 99.999999999% (11 neuf)
- Lifecycle rules (transition Glacier pour économies)
- Blocage accès public = sécurité

### Pourquoi Terraform au lieu de AWS Console ?

**Problème :** Infra manuelle = non reproductible, drift, erreurs humaines

**Décision :** Terraform

**Justification :**
- Infrastructure as code = versionnable, reviewable
- Reproductibilité = `terraform apply` recrée exactement la même infra
- Drift detection = alerte si modifications manuelles
- Multi-environnement = dev/staging/prod avec le même code

---

## 🎓 Compétences Démontrées

### Software Engineering
- **Architecture modulaire** : Découplage, single responsibility, dependency injection
- **Type safety** : TypeScript end-to-end (frontend + backend + Prisma)
- **Design patterns** : Repository, Factory, Strategy, Observer
- **Testing** : Tests unitaires, tests e2e, tests d'intégration

### Cloud Engineering
- **Infrastructure as Code** : Terraform modules, state management
- **Services managés** : RDS, S3, ECR (compréhension du trade-off managed vs self-hosted)
- **Networking** : VPC, subnets, security groups, route tables
- **Security** : IAM roles, least privilege, defense in depth

### DevSecOps
- **CI/CD** : GitHub Actions, automatisation complète du pipeline
- **Containerization** : Docker multi-stage builds, optimization
- **Secrets management** : Variables d'environnement, jamais de secrets dans le code
- **Monitoring** : CloudWatch logs, métriques, alertes

### Architecture
- **Scalability** : Séparation frontend/backend, base de données isolée
- **Reliability** : Backups automatiques, health checks, graceful shutdowns
- **Maintainability** : Code modulaire, documentation, conventions de nommage
- **Performance** : SSR, optimistic UI, database indexing, caching

---

## 📈 Roadmap

### Phase 1 : Core (✅ Complété)
- [x] Architecture modulaire
- [x] Multi-tenancy
- [x] Modules RH, CRM, Finance
- [x] Dockerisation
- [x] Infrastructure Terraform
- [x] CI/CD GitHub Actions

### Phase 2 : Advanced (En cours)
- [ ] Module POS complet
- [ ] Module Inventaire avancé
- [ ] Dashboard analytics
- [ ] Notifications (email, SMS)
- [ ] Webhooks pour intégrations tierces

### Phase 3 : Enterprise
- [ ] Multi-région AWS
- [ ] Auto Scaling Groups
- [ ] Load Balancer + CloudFront
- [ ] Redis caching
- [ ] Elasticsearch pour la recherche
- [ ] Architecture event-driven (SQS, Lambda)

---

## 📚 Documentation

- **Roadmap Cloud & DevSecOps** : [`infra/README.md`](./infra/README.md)
- **Guide de déploiement AWS** : [`infra/DEPLOYMENT_GUIDE.md`](./infra/DEPLOYMENT_GUIDE.md)
- **Secrets GitHub** : [`infra/GITHUB_SECRETS.md`](./infra/GITHUB_SECRETS.md)
- **Documentation métier** : [`docs/`](./docs/)

---

## 🤝 Contribution

Ce projet est un **portfolio technique** démontrant mes compétences en :

- Fullstack Development (TypeScript, React, NestJS)
- Cloud Architecture (AWS, Terraform, Docker)
- DevSecOps (CI/CD, Security, Automation)
- Software Architecture (Modular design, Patterns)

Pour toute question ou discussion sur l'architecture, n'hésitez pas à ouvrir une issue.

---

## 📝 Licence

MIT

---

**Développé avec ❤️ en tant que démonstration d'architecture cloud-native et d'ingénierie logicielle moderne.**
