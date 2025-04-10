# MailMentor - Assistant de réponse aux mails

MailMentor est une application web qui utilise l'intelligence artificielle pour générer des réponses aux emails. Grâce à un agent IA spécialisé basé sur Mistral, l'application analyse le contenu d'un email reçu et propose une réponse adaptée et professionnelle.

## Fonctionnalités

- Authentification sécurisée avec Supabase (inscription/connexion)
- Interface simple et intuitive
- Analyse de mails par intelligence artificielle
- Génération de réponses pertinentes et professionnelles
- Mode démo sans connexion
- Intégration avec l'agent de La Plateforme

## Technologies utilisées

- React + Vite pour le frontend
- Tailwind CSS pour le style
- Supabase pour l'authentification
- La Plateforme pour l'agent IA basé sur Mistral

## Installation

1. Cloner le repository
```bash
git clone <url-du-repo>
cd mailmentor
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
```bash
cp .env.example .env
```
Puis éditez le fichier `.env` pour ajouter votre clé API La Plateforme.

4. Démarrer l'application en mode développement
```bash
npm run dev
```

## Configuration

L'application nécessite les variables d'environnement suivantes:

- `VITE_LAPLATEFORME_API_KEY`: Clé API pour accéder à La Plateforme

## Utilisation

Deux modes d'utilisation sont disponibles :

### Avec authentification
1. Créez un compte ou connectez-vous
2. Accédez au dashboard 
3. Copiez-collez le contenu d'un email reçu dans la zone de texte
4. Cliquez sur "Générer une réponse"
5. L'agent IA analysera le mail et générera une réponse appropriée

### Mode démo
1. Accédez à la route `/demo`
2. Copiez-collez le contenu d'un email reçu
3. Générez une réponse sans avoir besoin de créer un compte

## À propos de l'agent IA

L'agent IA utilisé est hébergé sur La Plateforme et utilise le modèle Mistral pour générer des réponses professionnelles aux emails. L'ID de l'agent est :
```
ag:a8432394:20250409:mailmentoragent:4b1241d7
```

## Licence

MIT
