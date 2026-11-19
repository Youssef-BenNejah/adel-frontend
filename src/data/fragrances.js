// Non-catalog content: testimonials, store locations, ingredient ticker.
// Product data now lives in catalog.js (large synthetic catalog).

export const categories = [
  { id: 'homme', label: 'Homme' },
  { id: 'femme', label: 'Femme' },
  { id: 'unisexe', label: 'Unisexe' },
]

export const testimonials = [
  { name: 'Yasmine B.', city: 'Tunis', time: 'il y a 3 jours', rating: 5, product: 'Oud Impérial', quote: "Je payais 450 TND l'original. Adel m'a donné exactement la même expérience pour 72 TND. Le sillage tient toute la journée." },
  { name: 'Mehdi K.', city: 'Sfax', time: 'il y a 1 semaine', rating: 5, product: 'Vétiver Sauvage', quote: 'Mes collègues me demandent quel parfum je porte. Personne ne fait la différence. Commandé 3 fois.' },
  { name: 'Rania A.', city: 'Sousse', time: 'il y a 2 semaines', rating: 5, product: 'Vanilla Powder', quote: 'Vanille ronde et poudreuse, addictive. Livraison rapide, emballage soigné.' },
  { name: 'Sami H.', city: 'Monastir', time: 'il y a 3 semaines', rating: 5, product: 'Black Bomb', quote: 'Service impeccable. Le parfum est superbe — je recommande à tous mes amis sans hésitation.' },
]

export const stores = [
  { city: 'Bizerte', hours: 'Lun – Sam · 9h00 – 19h00', phone: '+216 23 315 498' },
  { city: 'Ariana', hours: 'Lun – Sam · 9h00 – 19h00', phone: '+216 71 820 455' },
  { city: 'Manouba', hours: 'Lun – Sam · 9h00 – 19h00', phone: '+216 71 554 902' },
  { city: 'Oued Ellil', hours: 'Lun – Sam · 9h00 – 19h00', phone: '+216 71 663 218' },
]

export const ingredients = [
  "OUD DU CAMBODGE", 'ROSE DE DAMAS', "SAFRAN D'IRAN", 'AMBRE GRIS', 'VANILLE BOURBON',
  'SANTAL ROYAL', 'MUSC BLANC', 'FÈVE TONKA', 'JASMIN SAMBAC', 'PATCHOULI',
]
