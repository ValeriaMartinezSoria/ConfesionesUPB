export type MapPoint = {
  id: string;
  title: string;
  subtitle?: string;
  latitude: number;
  longitude: number;
  city?: 'La Paz' | 'Cochabamba' | 'Santa Cruz';
  kind: 'UPB' | 'Spot';
  url?: string;
};

export const MAP_POINTS: MapPoint[] = [
  // UPB Campuses
  {
    id: 'upb-lapaz',
    title: 'UPB La Paz',
    subtitle: 'Campus Principal',
    latitude: -16.5752089,
    longitude: -68.1270692,
    city: 'La Paz',
    kind: 'UPB',
    url: 'https://www.google.com/maps/place/Universidad+Privada+Boliviana/@-16.5752089,-68.1270692,18z',
  },
  {
    id: 'upb-postgrado-lapaz',
    title: 'UPB Postgrado',
    subtitle: 'La Paz',
    latitude: -16.5245833,
    longitude: -68.1105426,
    city: 'La Paz',
    kind: 'UPB',
    url: 'https://www.google.com/maps/place/UPB+-+Post+Grado/@-16.5245833,-68.1105426,17z',
  },
  {
    id: 'upb-cochabamba',
    title: 'UPB Cochabamba',
    subtitle: 'Campus Cochabamba',
    latitude: -17.3988937,
    longitude: -66.2184957,
    city: 'Cochabamba',
    kind: 'UPB',
    url: 'https://www.google.com/maps/place/Universidad+Privada+Boliviana/@-17.3988937,-66.2184957,17z',
  },
  {
    id: 'upb-santacruz',
    title: 'UPB Santa Cruz',
    subtitle: 'Campus Santa Cruz',
    latitude: -17.8193696,
    longitude: -63.233488,
    city: 'Santa Cruz',
    kind: 'UPB',
    url: 'https://www.google.com/maps/place/UPB+Campus+Santa+Cruz/@-17.8193696,-63.233488,17z',
  },

  // Spots de interés
  {
    id: 'el-carrousel',
    title: 'El Carrousel',
    subtitle: 'Centro comercial / entretenimiento',
    latitude: -16.5418106,
    longitude: -68.0810369,
    city: 'La Paz',
    kind: 'Spot',
    url: 'https://www.google.com/maps/place/El+Carrousel/@-16.5418106,-68.0810369,18z',
  },
  {
    id: 'megacenter',
    title: 'MEGACENTER La Paz',
    subtitle: 'Centro comercial',
    latitude: -16.5323262,
    longitude: -68.0873421,
    city: 'La Paz',
    kind: 'Spot',
    url: 'https://www.google.com/maps/place/MEGACENTER+La+Paz/@-16.5323262,-68.0873421,17z',
  },
  {
    id: 'fuente-prado',
    title: 'Fuente del Prado',
    subtitle: 'Punto de encuentro / monumento histórico',
    latitude: -16.5037659,
    longitude: -68.1311965,
    city: 'La Paz',
    kind: 'Spot',
    url: 'https://www.google.com/maps/place/Fuente+del+Prado/@-16.5037659,-68.1311965,17z',
  },
];
