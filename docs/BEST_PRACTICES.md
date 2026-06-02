# Guide des Meilleures Pratiques - Optimisation et Sécurité

## Table des matières
1. [Optimisation des Requêtes Base de Données](#optimisation-des-requêtes-base-de-données)
2. [Indexation](#indexation)
3. [Pagination](#pagination)
4. [Mise en Cache](#mise-en-cache)
5. [Sécurité](#sécurité)
6. [Architecture Scalable](#architecture-scalable)

---

## 1. Optimisation des Requêtes Base de Données

### Problème
Récupérer toutes les données d'un coup ralentit l'application quand il y a beaucoup de données en base de données.

### Solutions

#### 1.1 Sélectionner uniquement les champs nécessaires
❌ **MAUVAIS** - Récupère tous les champs
```typescript
const products = await prisma.inventoryProduct.findMany();
```

✅ **BON** - Récupère uniquement les champs nécessaires
```typescript
const products = await prisma.inventoryProduct.findMany({
  select: {
    id: true,
    name: true,
    salePrice: true,
    stockQuantity: true,
    isAvailableOnline: true,
  },
});
```

#### 1.2 Utiliser les relations avec parcimonie
❌ **MAUVAIS** - Récupère toutes les relations
```typescript
const products = await prisma.inventoryProduct.findMany({
  include: {
    category: true,
    movements: true,
    alerts: true,
  },
});
```

✅ **BON** - Récupère uniquement les relations nécessaires
```typescript
const products = await prisma.inventoryProduct.findMany({
  include: {
    category: {
      select: {
        id: true,
        name: true,
      },
    },
  },
});
```

#### 1.3 Filtrer au niveau de la base de données
❌ **MAUVAIS** - Filtre côté application
```typescript
const allProducts = await prisma.inventoryProduct.findMany();
const availableProducts = allProducts.filter(p => p.isAvailableOnline);
```

✅ **BON** - Filtre côté base de données
```typescript
const availableProducts = await prisma.inventoryProduct.findMany({
  where: { isAvailableOnline: true },
});
```

#### 1.4 Limiter le nombre de résultats
❌ **MAUVAIS** - Récupère tous les résultats
```typescript
const products = await prisma.inventoryProduct.findMany();
```

✅ **BON** - Limite les résultats
```typescript
const products = await prisma.inventoryProduct.findMany({
  take: 50,
});
```

---

## 2. Indexation

### Pourquoi les index sont importants
Les index accélèrent les recherches en créant des structures de données optimisées pour les requêtes fréquentes.

### Créer des index dans Prisma

#### 2.1 Index sur les champs de recherche
```prisma
model InventoryProduct {
  id        String   @id @default(uuid())
  name      String
  sku       String?  @unique
  
  @@index([name])
  @@index([sku])
  @@index([companyId, isAvailableOnline])
}
```

#### 2.2 Index composites pour les requêtes fréquentes
```prisma
model InventoryProduct {
  companyId         String
  isAvailableOnline Boolean
  
  @@index([companyId, isAvailableOnline])
  @@index([companyId, sku])
}
```

#### 2.3 Index pour les relations
```prisma
model InventoryProduct {
  categoryId String?
  
  @@index([categoryId])
}
```

### Quand créer un index
- ✅ Champs utilisés dans WHERE
- ✅ Champs utilisés dans ORDER BY
- ✅ Champs utilisés dans JOIN
- ✅ Champs avec cardinalité élevée (beaucoup de valeurs différentes)
- ❌ Champs avec cardinalité faible (ex: boolean avec peu de valeurs)

---

## 3. Pagination

### Problème
Récupérer 10 000 enregistrements ralentit l'application et consomme beaucoup de mémoire.

### Solutions

#### 3.1 Pagination offset-based
```typescript
const page = 1;
const limit = 20;
const skip = (page - 1) * limit;

const products = await prisma.inventoryProduct.findMany({
  skip,
  take: limit,
});
```

**Inconvénient** : Lent pour les grandes pages (skip 1000 est lent)

#### 3.2 Pagination cursor-based (recommandé pour grandes quantités)
```typescript
const lastId = 'last-product-id';
const limit = 20;

const products = await prisma.inventoryProduct.findMany({
  take: limit,
  cursor: { id: lastId },
  skip: 1,
});
```

**Avantage** : Constant en performance même pour les grandes pages

#### 3.3 Pagination avec curseur dans l'API
```typescript
@Get()
async getProducts(
  @Query('cursor') cursor?: string,
  @Query('limit') limit = 20,
) {
  return this.prisma.inventoryProduct.findMany({
    take: limit + 1, // +1 pour vérifier s'il y a une page suivante
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : 0,
  });
}
```

---

## 4. Mise en Cache

### Pourquoi le cache est important
Évite de faire les mêmes requêtes à la base de données pour les données qui changent rarement.

### Niveaux de cache

#### 4.1 Cache au niveau application (Redis/Memory)
```typescript
import { Cache } from 'cache-manager';

const cacheManager = new Cache();

async function getProducts(companyId: string) {
  const cacheKey = `products:${companyId}`;
  
  // Vérifier le cache
  const cached = await cacheManager.get(cacheKey);
  if (cached) return cached;
  
  // Si pas en cache, requêter la BDD
  const products = await prisma.inventoryProduct.findMany({
    where: { companyId },
  });
  
  // Mettre en cache pour 5 minutes
  await cacheManager.set(cacheKey, products, 300);
  
  return products;
}
```

#### 4.2 Cache HTTP avec headers
```typescript
@Get()
@Header('Cache-Control', 'public, max-age=300')
async getProducts() {
  return this.inventoryService.getProducts();
}
```

#### 4.3 Invalidation du cache
```typescript
async function updateProduct(id: string, dto: UpdateProductDto) {
  const updated = await this.prisma.inventoryProduct.update({
    where: { id },
    data: dto,
  });
  
  // Invalider le cache
  await cacheManager.del(`products:${updated.companyId}`);
  
  return updated;
}
```

---

## 5. Sécurité

### 5.1 Validation des entrées
```typescript
import { IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsNumber()
  @Min(0)
  @Max(1000000)
  salePrice: number;
}
```

### 5.2 Protection contre les injections SQL
Prisma utilise des requêtes paramétrées par défaut, donc vous êtes protégé contre les injections SQL.

✅ **SÉCURISÉ**
```typescript
const product = await prisma.inventoryProduct.findMany({
  where: { name: userInput }, // Prisma gère automatiquement l'échappement
});
```

### 5.3 Protection contre les attaques brute-force
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite à 100 requêtes par IP
});

app.use('/api/', limiter);
```

### 5.4 Protection CORS
```typescript
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
});
```

### 5.5 Protection des données sensibles
❌ **MAUVAIS** - Renvoie toutes les données
```typescript
const user = await prisma.user.findUnique({ where: { id } });
return user; // Inclut password hash, etc.
```

✅ **BON** - Renvoie uniquement les données nécessaires
```typescript
const user = await prisma.user.findUnique({
  where: { id },
  select: {
    id: true,
    email: true,
    name: true,
    // PAS de password, etc.
  },
});
```

### 5.6 Authentification et Autorisation
```typescript
// Vérifier l'authentification
@UseGuards(AuthGuard)
@Get('products')
getProducts(@Req() req) {
  const userId = req.user.id;
  // ...
}

// Vérifier les permissions
@UseGuards(AuthGuard, PermissionGuard)
@RequirePermission('INVENTORY', 'READ')
@Get('products')
getProducts() {
  // ...
}
```

---

## 6. Architecture Scalable

### 6.1 Séparation des responsabilités
```typescript
// Service - Logique métier
@Injectable()
export class InventoryService {
  async getProducts(companyId: string) {
    return this.prisma.inventoryProduct.findMany({
      where: { companyId },
    });
  }
}

// Controller - Gestion des requêtes HTTP
@Controller('inventory')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}
  
  @Get('products')
  getProducts(@Param('companyId') companyId: string) {
    return this.inventoryService.getProducts(companyId);
  }
}
```

### 6.2 Utiliser des DTO pour la validation
```typescript
export class GetProductsDto {
  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}
```

### 6.3 Gestion des erreurs
```typescript
async function getProducts(filters: GetProductsDto) {
  try {
    return await prisma.inventoryProduct.findMany({
      where: filters,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Erreur Prisma connue
      throw new BadRequestException('Invalid request');
    }
    // Erreur inattendue
    throw new InternalServerErrorException();
  }
}
```

### 6.4 Logging
```typescript
import { Logger } from '@nestjs/common';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  async getProducts(companyId: string) {
    this.logger.log(`Fetching products for company ${companyId}`);
    // ...
  }
}
```

---

## 7. Bonnes Pratiques Spécifiques à ce Projet

### 7.1 Pour l'inventaire
- ✅ Utiliser `select` pour récupérer uniquement les champs nécessaires
- ✅ Ajouter des index sur `companyId`, `sku`, `isAvailableOnline`
- ✅ Paginer les résultats (cursor-based pour les grandes quantités)
- ✅ Mettre en cache les catégories (changent rarement)
- ✅ Ne pas inclure les relations `movements` et `alerts` par défaut

### 7.2 Pour l'e-commerce
- ✅ Récupérer uniquement les produits `isAvailableOnline: true` pour la boutique
- ✅ Mettre en cache les produits disponibles (court TTL : 30s)
- ✅ Index sur `companyId, isAvailableOnline`
- ✅ Sélectionner uniquement les champs e-commerce nécessaires

### 7.3 Pour les images
- ✅ Stocker les fichiers sur le disque, pas en base64 dans la BDD
- ✅ Stocker uniquement les URLs dans la BDD
- ✅ Utiliser CDN pour la production (Cloudinary, AWS S3, etc.)
- ✅ Compresser les images avant upload
- ✅ Utiliser des formats modernes (WebP, AVIF)

---

## 8. Checklist Avant de Mettre en Production

### Performance
- [ ] Les requêtes utilisent `select` au lieu de `include` complet
- [ ] Les champs de recherche ont des index
- [ ] La pagination est implémentée
- [ ] Le cache est configuré pour les données statiques
- [ ] Les N+1 queries sont évitées

### Sécurité
- [ ] Les entrées sont validées
- [ ] L'authentification est implémentée
- [ ] L'autorisation est implémentée (RBAC)
- [ ] CORS est configuré correctement
- [ ] Les rate limits sont en place
- [ ] Les données sensibles ne sont pas exposées

### Architecture
- [ ] La séparation des responsabilités est respectée
- [ ] Les DTO sont utilisés pour la validation
- [ ] La gestion des erreurs est centralisée
- [ ] Le logging est implémenté
- [ ] Les tests sont écrits

---

## 9. Outils de Monitoring

### 9.1 Monitoring de performance
- **Prisma Accelerate** : Monitoring des requêtes Prisma
- **New Relic / Datadog** : Monitoring APM
- **Prometheus + Grafana** : Métriques personnalisées

### 9.2 Monitoring de sécurité
- **Snyk** : Détection de vulnérabilités
- **OWASP ZAP** : Tests de sécurité
- **Helmet** : En-têtes de sécurité HTTP

---

## 10. Ressources

- [Prisma Performance](https://www.prisma.io/docs/guides/performance-and-optimization)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NestJS Security](https://docs.nestjs.com/security)
- [Database Indexing Best Practices](https://use-the-index-luke.com/)

---

**Note** : Ce guide est un document vivant. Mettez-le à jour régulièrement avec les nouvelles meilleures pratiques et les leçons apprises.
