/**
 * Données du site, centralisées pour rester faciles à modifier.
 *
 * Le numéro de téléphone n'est jamais écrit en entier dans le code.
 * Il est stocké en deux morceaux, assemblés à l'exécution, et il n'entre
 * dans le DOM qu'au moment où la personne demande à l'afficher.
 * Les morceaux passent par un tableau et par join, jamais par une
 * concaténation de littéraux, pour que le bundler ne les recolle pas
 * à la compilation.
 */

const PHONE_PARTS = ['06 63', '25 36 13']

/** Numéro formaté pour l'affichage, assemblé à l'exécution. */
export function phoneDisplay() {
  return PHONE_PARTS.join(' ')
}

/** Lien tel: assemblé à l'exécution, sans espace. */
export function phoneHref() {
  return 'tel:' + PHONE_PARTS.join(' ').replace(/\s/g, '')
}

export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'
export const WEB3FORMS_ACCESS_KEY = '268cfbf8-fb46-4858-988d-4bb5d25f49ad'

/** Communes de la Pévèle, mises en avant. */
export const COMMUNES_PEVELE = [
  'Templeuve',
  'Cysoing',
  'Orchies',
  'Pont-à-Marcq',
  'Genech',
]

/** Communes de la Métropole de Lille. */
export const COMMUNES_METROPOLE = [
  'Mons-en-Pévèle',
  'Fretin',
  'Ennevelin',
  'Villeneuve-d’Ascq',
  'Seclin',
  'Lille',
  'Marcq-en-Barœul',
  'Lambersart',
  'Wambrechies',
  'Bondues',
  'Beaucamps-Ligny',
]
