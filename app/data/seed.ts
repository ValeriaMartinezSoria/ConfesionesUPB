export type Category = "amor" | "academico" | "random" | "carrera" | "facultad";

export type Facultad =
  | "Facultad de Ciencias Empresariales y Derecho"
  | "Facultad de Ingenierías y Arquitectura";

export const FACULTADES_DISPONIBLES: Facultad[] = [
  "Facultad de Ciencias Empresariales y Derecho",
  "Facultad de Ingenierías y Arquitectura",
];

export type Carrera =
  | "ADMINISTRACIÓN DE EMPRESAS"
  | "ANALÍTICA GERENCIAL DE DATOS"
  | "COMUNICACIÓN"
  | "DERECHO"
  | "DISEÑO GRÁFICO"
  | "ECONOMÍA"
  | "INGENIERÍA COMERCIAL"
  | "INGENIERÍA FINANCIERA"
  | "MARKETING Y LOGÍSTICA"
  | "PSICOLOGÍA ORGANIZACIONAL"
  | "RELACIONES Y NEGOCIOS INTERNACIONALES"
  | "ARQUITECTURA"
  | "BIOINGENIERÍA EN RECURSOS NATURALES"
  | "INGENIERÍA CIVIL"
  | "INGENIERÍA DE INTELIGENCIA ARTIFICIAL"
  | "INGENIERÍA DE LA PRODUCCIÓN"
  | "INGENIERÍA DE SISTEMAS COMPUTACIONALES"
  | "INGENIERÍA DEL MEDIO AMBIENTE Y ENERGÍAS ALTERNATIVAS"
  | "INGENIERÍA ELECTROMECÁNICA"
  | "INGENIERÍA ELECTRÓNICA Y TELECOMUNICACIONES"
  | "INGENIERÍA INDUSTRIAL Y DE SISTEMAS";

export const CARRERAS_DISPONIBLES: Carrera[] = [
  "ADMINISTRACIÓN DE EMPRESAS",
  "ANALÍTICA GERENCIAL DE DATOS",
  "COMUNICACIÓN",
  "DERECHO",
  "DISEÑO GRÁFICO",
  "ECONOMÍA",
  "INGENIERÍA COMERCIAL",
  "INGENIERÍA FINANCIERA",
  "MARKETING Y LOGÍSTICA",
  "PSICOLOGÍA ORGANIZACIONAL",
  "RELACIONES Y NEGOCIOS INTERNACIONALES",
  "ARQUITECTURA",
  "BIOINGENIERÍA EN RECURSOS NATURALES",
  "INGENIERÍA CIVIL",
  "INGENIERÍA DE INTELIGENCIA ARTIFICIAL",
  "INGENIERÍA DE LA PRODUCCIÓN",
  "INGENIERÍA DE SISTEMAS COMPUTACIONALES",
  "INGENIERÍA DEL MEDIO AMBIENTE Y ENERGÍAS ALTERNATIVAS",
  "INGENIERÍA ELECTROMECÁNICA",
  "INGENIERÍA ELECTRÓNICA Y TELECOMUNICACIONES",
  "INGENIERÍA INDUSTRIAL Y DE SISTEMAS",
];

export const CARRERAS_POR_FACULTAD: Record<Facultad, Carrera[]> = {
  "Facultad de Ciencias Empresariales y Derecho": [
    "ADMINISTRACIÓN DE EMPRESAS",
    "ANALÍTICA GERENCIAL DE DATOS",
    "COMUNICACIÓN",
    "DERECHO",
    "DISEÑO GRÁFICO",
    "ECONOMÍA",
    "INGENIERÍA COMERCIAL",
    "INGENIERÍA FINANCIERA",
    "MARKETING Y LOGÍSTICA",
    "PSICOLOGÍA ORGANIZACIONAL",
    "RELACIONES Y NEGOCIOS INTERNACIONALES",
  ],
  "Facultad de Ingenierías y Arquitectura": [
    "ARQUITECTURA",
    "BIOINGENIERÍA EN RECURSOS NATURALES",
    "INGENIERÍA CIVIL",
    "INGENIERÍA DE INTELIGENCIA ARTIFICIAL",
    "INGENIERÍA DE LA PRODUCCIÓN",
    "INGENIERÍA DE SISTEMAS COMPUTACIONALES",
    "INGENIERÍA DEL MEDIO AMBIENTE Y ENERGÍAS ALTERNATIVAS",
    "INGENIERÍA ELECTROMECÁNICA",
    "INGENIERÍA ELECTRÓNICA Y TELECOMUNICACIONES",
    "INGENIERÍA INDUSTRIAL Y DE SISTEMAS",
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
    carrera: "ADMINISTRACIÓN DE EMPRESAS",
    date: Date.now() - 1000 * 60 * 60,
    likes: 2,
    nexo: "Anónimo",
  },
  {
    id: 2,
    content: "El examen de cálculo estuvo brutal, ojalá suban la nota.",
    category: "academico",
    carrera: "INGENIERÍA DE SISTEMAS COMPUTACIONALES",
    date: Date.now() - 1000 * 60 * 160,
    likes: 4,
    nexo: "Anónimo",
  },
  {
    id: 3,
    content: "Vi un perrito en la cafetería y me alegró el día.",
    category: "random",
    carrera: "MARKETING Y LOGÍSTICA",
    date: Date.now() - 1000 * 60 * 300,
    likes: 1,
    nexo: "Anónimo",
  },
];

export const seedPendientes: Confesion[] = [
  {
    id: 101,
    content: "Confieso que dejé todo para la última semana.",
    category: "academico",
    carrera: "INGENIERÍA COMERCIAL",
    date: Date.now() - 1000 * 60 * 30,
    likes: 0,
    nexo: "Anónimo",
  },
];
