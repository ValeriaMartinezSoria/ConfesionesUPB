export type Category = "amor" | "academico" | "random" | "confesion";

export type Facultad =
  | "Ingeniería y Tecnología"
  | "Economía y Negocios"
  | "Ciencias Sociales"
  | "Diseño y Arquitectura"
  | "Ciencias de la Salud"
  | "Derecho";

export const FACULTADES_DISPONIBLES: Facultad[] = [
  "Ingeniería y Tecnología",
  "Economía y Negocios",
  "Ciencias Sociales",
  "Diseño y Arquitectura",
  "Ciencias de la Salud",
  "Derecho",
];

export type Carrera =
  | "Administración de Empresas"
  | "Ingeniería de Sistemas"
  | "Diseño Gráfico"
  | "Psicología"
  | "Derecho"
  | "Ingeniería Civil"
  | "Ingeniería Industrial"
  | "Arquitectura"
  | "Medicina"
  | "Enfermería"
  | "Contaduría Pública"
  | "Marketing"
  | "Comunicación"
  | "Trabajo Social";

export const CARRERAS_DISPONIBLES: Carrera[] = [
  "Administración de Empresas",
  "Ingeniería de Sistemas",
  "Diseño Gráfico",
  "Psicología",
  "Derecho",
  "Ingeniería Civil",
  "Ingeniería Industrial",
  "Arquitectura",
  "Medicina",
  "Enfermería",
  "Contaduría Pública",
  "Marketing",
  "Comunicación",
  "Trabajo Social",
];

export const CARRERAS_POR_FACULTAD: Record<Facultad, Carrera[]> = {
  "Ingeniería y Tecnología": [
    "Ingeniería de Sistemas",
    "Ingeniería Civil",
    "Ingeniería Industrial",
  ],
  "Economía y Negocios": [
    "Administración de Empresas",
    "Contaduría Pública",
    "Marketing",
  ],
  "Ciencias Sociales": [
    "Psicología",
    "Comunicación",
    "Trabajo Social",
  ],
  "Diseño y Arquitectura": [
    "Diseño Gráfico",
    "Arquitectura",
  ],
  "Ciencias de la Salud": [
    "Medicina",
    "Enfermería",
  ],
  "Derecho": [
    "Derecho",
  ],
};

export type Confesion = {
  id: number;
  content: string;
  category: Category;
  carrera: string;
  date: number;
  likes: number;
  image?: any;
  nexo?: string;
};

export const seedAprobadas: Confesion[] = [
  {
    id: 1,
    content: "Me gusta alguien del aula 302 pero no sé cómo hablarle.",
    category: "amor",
    carrera: "Administración de Empresas",
    date: Date.now() - 1000 * 60 * 60,
    likes: 2,
    nexo: "Anónimo",
  },
  {
    id: 2,
    content: "El examen de cálculo estuvo brutal, ojalá suban la nota.",
    category: "academico",
    carrera: "Ingeniería de Sistemas",
    date: Date.now() - 1000 * 60 * 160,
    likes: 4,
    nexo: "Anónimo",
  },
  {
    id: 3,
    content: "Vi un perrito en la cafetería y me alegró el día.",
    category: "random",
    carrera: "Diseño Gráfico",
    date: Date.now() - 1000 * 60 * 300,
    likes: 1,
    nexo: "Anónimo",
    image: require("../../assets/icon.png"),
  },
];

export const seedPendientes: Confesion[] = [
  {
    id: 101,
    content: "Confieso que dejé todo para la última semana.",
    category: "academico",
    carrera: "Ingeniería Comercial",
    date: Date.now() - 1000 * 60 * 30,
    likes: 0,
    nexo: "Anónimo",
  },
];
