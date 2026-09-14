# Albert à tout faire

Site vitrine statique, une page, pour Albert à tout faire, artisan multiservices en Pévèle
et dans la Métropole de Lille.

## Stack

Vite, React, CSS custom avec variables. Icônes lucide react. Aucune librairie de composants,
aucun framework CSS. Une seule famille de caractères, Plus Jakarta Sans.

## Démarrer

```bash
npm install
npm run dev      # serveur de développement
npm run build    # génère le dossier dist
npm run preview  # sert le dossier dist en local
```

Le dossier `dist` produit est un site statique : il se déploie tel quel sur un hébergement
statique (Netlify, Vercel, OVH, Infomaniak, etc.).

## Protection du numéro de téléphone

Le numéro n'apparaît jamais en clair, ni dans le HTML livré, ni dans le bundle JavaScript,
ni dans le JSON LD. Il est stocké en deux morceaux dans `src/site.js` :

```js
const PHONE_PARTS = ['06 63', '25 36 13']
```

Les morceaux sont assemblés à l'exécution, via `join`, jamais par concaténation de deux
littéraux : un bundler recollerait les littéraux à la compilation, pas un appel de méthode.
Le numéro n'entre dans le DOM qu'au clic sur un bouton « Afficher le numéro ». Un clic
suffit, le numéro est alors visible aux trois endroits de la page (barre de navigation,
carte du hero, section contact).

Pour changer de numéro, modifiez les deux morceaux. Pour vérifier qu'aucune fuite n'a été
introduite :

```bash
npm run build
grep -rc -e "06 63 25 36 13" -e "0663253613" dist/
```

Toutes les lignes doivent afficher `:0`.

Le schema.org `LocalBusiness` ne contient volontairement ni `telephone` ni `email`.

## Contenu à modifier

| Quoi | Où |
| --- | --- |
| Morceaux du numéro | `src/site.js` |
| Clé Web3Forms du formulaire | `src/site.js` |
| Communes desservies, deux niveaux | `src/site.js` |
| Services listés | `src/components/Services.jsx` |
| Formations et expérience | `src/components/Formations.jsx` |
| Arguments « pourquoi Albert » | `src/components/WhyAlbert.jsx` |
| Titre, description, Open Graph, JSON LD | `index.html` |
| Couleurs, typographie, espacements | `src/styles.css`, section Tokens |

## Placeholders à compléter

À renseigner avant mise en ligne.

Dans `src/components/Formations.jsx` :

- `XX ans` en entreprise
- `[diplôme à compléter]`
- `[habilitation à compléter]`

Dans `index.html`, bloc JSON LD :

- `addressLocality` vaut `[commune à compléter]`, à remplacer par la commune d’Albert

Dans `index.html`, bloc Open Graph :

- `og:image` est en commentaire, à décommenter quand la photo d’Albert sera disponible,
  au format 1200 x 630 pixels déposé dans `public/`

## Formulaire

Le formulaire envoie les demandes via Web3Forms vers l'adresse associée à la clé d'accès.
Champs transmis : nom, téléphone, commune, besoin. Un champ piège `botcheck` filtre les
robots. Les états d'envoi, de succès et d'erreur sont annoncés dans une région `aria-live`.
