# Albert à tout faire

Site vitrine statique pour Albert à tout faire, artisan multiservices en Pévèle et dans la
Métropole de Lille. Deux pages : l'accueil (`index.html`) et les mentions légales
(`mentions-legales.html`), déclarées toutes deux dans `vite.config.js`.

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

## Protection de l'adresse e-mail

Même principe que pour le numéro. L'adresse est stockée en deux morceaux dans `src/site.js`,
assemblés à l'exécution via `join` :

```js
const EMAIL_PARTS = ['contact.albertatoutfaire', 'gmail.com']
```

Elle n'entre dans le DOM, sous forme de lien `mailto:`, qu'au clic sur un bouton « Afficher
le mail ». Un clic suffit, l'adresse est alors visible partout
sur la page (barre de navigation, carte du hero, section contact, pied de page). Le
composant vit dans `src/email.jsx` et reprend le balisage et les styles de la révélation
du numéro. Sur mobile, dans la barre de navigation, il se réduit à son icône.

La page des mentions légales affiche elle aussi numéro et adresse via ces boutons.

Pour vérifier qu'aucune fuite n'a été introduite :

```bash
npm run build
grep -rc -e "contact.albertatoutfaire@gmail.com" -e "mailto:contact" dist/
```

Toutes les lignes doivent afficher `:0`.

Le schema.org `LocalBusiness` ne contient volontairement ni `telephone` ni `email`.

## Contenu à modifier

| Quoi | Où |
| --- | --- |
| Morceaux du numéro | `src/site.js` |
| Morceaux de l'adresse e-mail | `src/site.js` |
| Clé Web3Forms du formulaire | `src/site.js` |
| Lien de réservation de visite (`URL_RESERVATION`, vide = bouton masqué) | `src/site.js` |
| Chantiers de la section Réalisations (généré par `npm run photos`) | `src/data/realisations.json` |
| Communes desservies, deux niveaux | `src/site.js` |
| Services listés | `src/components/Services.jsx` |
| Formations et expérience | `src/components/Formations.jsx` |
| Arguments « pourquoi Albert » | `src/components/WhyAlbert.jsx` |
| Titre, description, Open Graph, JSON LD | `index.html` |
| Mentions légales (SIREN à compléter) | `src/MentionsLegales.jsx` |
| Ligne légale du pied de page | `src/components/Footer.jsx` |
| Couleurs, typographie, espacements | `src/styles.css`, section Tokens |

## Formulaire

Le formulaire envoie les demandes via Web3Forms vers l'adresse associée à la clé d'accès.
Champs transmis : nom, téléphone, e-mail (facultatif), commune, type de prestation (liste
alignée sur les services de `src/components/Services.jsx`), description, surface ou nombre
d'éléments, matériel déjà acheté (oui, non, en partie), urgence (oui ou non) et
disponibilités. Nom, téléphone, commune, type de prestation et description sont
obligatoires. Les champs facultatifs laissés vides ne sont pas transmis. Objet du mail :
« Nouvelle demande : [type], [commune] », précédé de « URGENT : » quand la case est cochée
(aucun tiret dans les objets). Après envoi : « Merci, votre demande est bien reçue. Réponse
sous 48 h. » Un champ piège `botcheck` filtre les robots. Les états d'envoi, de succès et
d'erreur sont annoncés dans une région `aria-live`.

Pas de photos jointes : chez Web3Forms, les pièces jointes sont réservées aux offres
payantes. Une phrase sous le formulaire invite à les envoyer en réponse au mail.

## Réservation d'une visite

Le bouton « Réserver une visite de devis gratuite » (accueil et section contact) ouvre
`URL_RESERVATION` (`src/site.js`) dans un nouvel onglet. Constante vide : bouton masqué.

## Section Réalisations

`src/components/Realisations.jsx` lit `src/data/realisations.json` : une carte par chantier,
photos avant et après côte à côte quand elles existent, sinon les photos du chantier
(vignettes 600 px, chargement différé), agrandissement en 1600 px au clic, au clavier
(flèches pour passer d'une photo à l'autre, Échap pour fermer). Tant que le fichier est vide,
la section et le lien « Réalisations » du menu ne s'affichent pas.

## Photos des réalisations

```bash
npm run photos
```

1. Déposer les photos dans `photos-a-traiter/`, un sous-dossier par chantier nommé
   « Commune, travaux » (ex. `Templeuve, peinture d'une chambre`). Une photo dont le nom
   contient « avant » ou « apres » est classée comme telle, les autres comme photos du
   chantier.
2. Le script (`scripts/photos-realisations.mjs`) produit pour chaque photo un WebP qualité
   80 de 1600 px maxi et une vignette de 600 px, sans aucune métadonnée (EXIF, GPS compris),
   dans `public/images/realisations/<chantier>/`, et met à jour `src/data/realisations.json`
   (titre, commune, travaux, date de prise de vue, photos ; du plus récent au plus ancien).
3. Les originaux traités partent dans `photos-traitees/`. Ces deux dossiers d'originaux
   sont ignorés par git : ils ne sont jamais publiés.

Les photos d'iPhone en HEIC ou HEIF sont acceptées telles quelles : seule l'image principale
du fichier est gardée (rafale, Live Photo), à l'endroit, avec sa date de prise de vue, et sans
aucune métadonnée dans les WebP produits.

Le script peut être relancé sans risque : il ne crée aucun doublon. Une photo illisible ou
un dossier mal nommé est signalé et laissé en place.
