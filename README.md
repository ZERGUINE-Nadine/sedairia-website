# Site Web Sedairia

Ce dépôt contient le code source du **site web Sedairia**, un projet développé pour créer un site moderne et réactif pour une agence de traduction située à Guelma, offrant des services de traduction en arabe, français et anglais.

## Présentation du Projet

Le site sert de plateforme professionnelle pour l'agence Sedairia afin de présenter ses services et faciliter la prise de contact avec les clients ou les demandes de traduction. Il inclut les fonctionnalités suivantes :
- **Informations sur les Services** : Descriptions détaillées des services de traduction proposés.
- **Traductions Certifiées** : Mise en avant des certifications pour les usages administratifs et juridiques.
- **Contact et Prise de Rendez-vous** : Intégration de formulaires pour prendre rendez-vous avec l'agence.
- **UI/UX Moderne** : Un design épuré et intuitif, amélioré par des animations et un affichage réactif.

## Fonctionnalités Clés
- **Design Réactif** : Conçu pour être entièrement fonctionnel sur appareils mobiles et ordinateurs de bureau.
- **Cartes de Services** : Une section présentant les différents services avec des cartes modernes et des animations élégantes.
- **Calendrier** : Intégration d'un calendrier pour la prise de rendez-vous, avec les jours du week-end désactivés.
- **Téléchargement de Fichiers** : Un formulaire permettant aux clients de télécharger des fichiers (PDF uniquement) pour leurs demandes de traduction.

## Stack Technique
- **Frontend** : Angular 18 avec Tailwind CSS pour le style et le design réactif.
- **Backend** : Node.js avec Sequelize pour la gestion des rendez-vous et des données utilisateurs.
- **Base de Données** : PostgresSQL pour le stockage des informations des rendez-vous.

## Instructions d'Installation

### Prérequis
- Node.js (version 18+)
- Angular CLI
- PostgresSQL

### Installation

1. Cloner le dépôt :
    ```bash
    git clone https://github.com/ZERGUINE-Nadine/sedairia-website.git
    cd sedairia-website
    ```

2. Installer les dépendances :
    ```bash
    npm install
    ```

3. Lancer l'application :
    ```bash
    ng serve
    ```

5. Le site sera accessible à l'adresse `http://localhost:4200/`.

### Configuration du Backend

1. Naviguer vers le dossier backend :
    ```bash
    cd backend
    ```

2. Installer les dépendances :
    ```bash
    npm install
    ```

3. Démarrer le serveur backend :
    ```bash
    npm run start
    ```

## Utilisation

Une fois l'installation terminée, vous pouvez commencer à explorer les fonctionnalités du site, telles que la consultation des services, la prise de rendez-vous et le téléchargement de fichiers pour la traduction.
