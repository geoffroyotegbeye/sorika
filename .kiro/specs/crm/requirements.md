# Module CRM - Exigences

## Vue d'ensemble
Module de gestion de la relation client (CRM) pour gérer les contacts, entreprises clientes, opportunités de vente et activités commerciales.

## Objectifs
- Centraliser les informations clients et prospects
- Suivre le pipeline de ventes
- Gérer les activités commerciales (appels, réunions, tâches)
- Améliorer la conversion et le suivi client

## Fonctionnalités principales

### 1. Gestion des Contacts
**Description** : Gérer les personnes (clients, prospects, partenaires)

**Champs** :
- Informations de base : Prénom, Nom, Email, Téléphone
- Entreprise associée (optionnel)
- Propriétaire (commercial responsable)
- Statut : LEAD, PROSPECT, CLIENT, PARTNER
- Source : WEBSITE, REFERRAL, SOCIAL_MEDIA, EVENT, OTHER
- Tags (pour catégorisation)
- Notes
- Dates : Création, Dernière interaction

**Actions** :
- Créer/Modifier/Supprimer un contact
- Assigner à un commercial
- Ajouter des notes
- Voir l'historique des activités
- Filtrer par statut, source, propriétaire

### 2. Gestion des Entreprises
**Description** : Gérer les organisations clientes

**Champs** :
- Nom de l'entreprise
- Secteur d'activité (Industry)
- Taille : SMALL (1-10), MEDIUM (11-50), LARGE (51-200), ENTERPRISE (200+)
- Site web
- Adresse
- Téléphone
- Propriétaire (commercial responsable)
- Notes
- Contacts associés (liste)

**Actions** :
- Créer/Modifier/Supprimer une entreprise
- Lier des contacts
- Voir les opportunités liées
- Voir l'historique des activités

### 3. Gestion des Opportunités (Pipeline)
**Description** : Suivre les deals et le pipeline de ventes

**Champs** :
- Titre de l'opportunité
- Montant estimé
- Devise (héritée de l'organisation)
- Probabilité de closing (%)
- Étape du pipeline :
  - LEAD (Prospect initial)
  - QUALIFIED (Qualifié)
  - PROPOSAL (Proposition envoyée)
  - NEGOTIATION (Négociation)
  - WON (Gagné)
  - LOST (Perdu)
- Contact associé
- Entreprise associée
- Propriétaire (commercial)
- Date de closing prévue
- Date de closing réelle
- Raison de perte (si LOST)
- Notes

**Actions** :
- Créer/Modifier/Supprimer une opportunité
- Changer l'étape (drag & drop dans kanban)
- Marquer comme gagnée/perdue
- Voir l'historique des activités
- Filtrer par étape, propriétaire, montant

### 4. Gestion des Activités
**Description** : Suivre les interactions avec les clients

**Types d'activités** :
- CALL (Appel téléphonique)
- EMAIL (Email)
- MEETING (Réunion)
- TASK (Tâche à faire)
- NOTE (Note simple)

**Champs** :
- Type d'activité
- Sujet
- Description
- Contact lié (optionnel)
- Entreprise liée (optionnel)
- Opportunité liée (optionnel)
- Propriétaire (qui doit faire l'activité)
- Date d'échéance (pour tâches)
- Date de réalisation
- Statut : PLANNED, COMPLETED, CANCELLED
- Durée (pour appels/réunions)

**Actions** :
- Créer/Modifier/Supprimer une activité
- Marquer comme complétée
- Filtrer par type, statut, propriétaire
- Vue calendrier
- Vue liste

### 5. Dashboard CRM
**Description** : Vue d'ensemble des performances commerciales

**Statistiques** :
- Nombre total de contacts (par statut)
- Nombre d'entreprises clientes
- Pipeline de ventes :
  - Valeur totale du pipeline
  - Nombre d'opportunités par étape
  - Taux de conversion
- Activités :
  - Activités à venir (aujourd'hui, cette semaine)
  - Activités en retard
- Top commerciaux (par CA généré)

**Visualisations** :
- Graphique du pipeline (kanban ou funnel)
- Évolution du CA (ligne)
- Répartition des opportunités par étape (donut)

## Permissions
- **READ** : Voir les données CRM
- **CREATE** : Créer contacts, entreprises, opportunités, activités
- **UPDATE** : Modifier les données
- **DELETE** : Supprimer les données
- **MANAGE** : Gérer les paramètres CRM

## Règles métier

### Contacts
- Email unique par organisation
- Un contact peut être lié à une seule entreprise
- Suppression d'un contact = suppression des activités liées

### Entreprises
- Nom unique par organisation
- Suppression d'une entreprise = suppression des contacts et opportunités liés

### Opportunités
- Montant doit être positif
- Date de closing prévue ne peut pas être dans le passé
- Une opportunité WON doit avoir une date de closing réelle
- Une opportunité LOST doit avoir une raison

### Activités
- Date d'échéance ne peut pas être dans le passé (pour nouvelles activités)
- Une activité COMPLETED doit avoir une date de réalisation
- Durée doit être positive

## Intégrations futures
- Import/Export CSV (contacts, entreprises)
- Synchronisation emails
- Intégration calendrier
- Webhooks pour automatisation

## Priorités MVP
1. ✅ **P0** : Contacts, Entreprises (CRUD de base)
2. ✅ **P0** : Opportunités avec pipeline kanban
3. ✅ **P0** : Activités (liste simple)
4. ✅ **P1** : Dashboard avec stats
5. ⏳ **P2** : Vue calendrier des activités
6. ⏳ **P2** : Import/Export CSV
7. ⏳ **P3** : Rapports avancés
