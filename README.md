# Albert à tout faire

Site vitrine statique, une page, pour Albert à tout faire, artisan multiservices en Pévèle
et dans la périphérie de Lille.

## Stack

Vite, React, CSS custom avec variables. Icônes lucide react. Aucune librairie de composants,
aucun framework CSS.

## Démarrer

```bash
npm install
npm run dev      # serveur de développement
npm run build    # génère le dossier dist
npm run preview  # sert le dossier dist en local
```

Le dossier `dist` produit est un site statique : il se déploie tel quel sur un hébergement
statique (Netlify, Vercel, OVH, Infomaniak, etc.).

## Contenu à modifier

| Quoi | Où |
| --- | --- |
| Téléphone, email, communes | `src/site.js` |
| Clé Web3Forms du formulaire | `src/site.js` |
| Services listés | `src/components/Services.jsx` |
| Arguments « pourquoi Albert » | `src/components/WhyAlbert.jsx` |
| Titre, description, Open Graph, JSON LD | `index.html` |
| Couleurs, typographie, espacements | `src/styles.css`, section Tokens |

## Photo d'Albert

L'emplacement est prévu dans la section « Pourquoi Albert », avec un cadre fin laiton.
Déposez l'image dans `public/`, puis dans `src/components/WhyAlbert.jsx` remplacez :

```js
const PHOTO = null
```

par :

```js
const PHOTO = '/albert.jpg'
```

Sans photo, le cadre affiche le monogramme, la mise en page reste complète.

## Formulaire

Le formulaire envoie les demandes via Web3Forms vers l'adresse associée à la clé d'accès.
Champs transmis : nom, téléphone, commune, besoin. Un champ piège `botcheck` filtre les robots.
