export type Category = "amor" | "academico" | "random";

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
