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
  // FIA - Facultad de Ingenierías y Arquitectura
  | "Arquitectura"
  | "Ingeniería Civil"
  | "Ingeniería Electromecánica"
  | "Ingeniería del Medio Ambiente y Energías Alternativas"
  | "Ingeniería de la Producción"
  | "Ingeniería de Sistemas"
  | "Ingeniería de Petróleo y Gas Natural"
  | "Ingeniería de Sistemas Electrónicos y Telecomunicaciones"
  | "Ingeniería Industrial y de Sistemas"
  | "Inteligencia Artificial"
  // FACED - Facultad de Ciencias Empresariales y Derecho
  | "Administración de Empresas"
  | "Analítica Gerencial de Datos"
  | "Economía"
  | "Ingeniería Comercial"
  | "Ingeniería Financiera"
  | "Marketing y Logística"
  | "Relaciones y Negocios Internacionales"
  | "Derecho"
  | "Psicología Organizacional";

export const CARRERAS_DISPONIBLES: Carrera[] = [
  // FIA
  "Arquitectura",
  "Ingeniería Civil",
  "Ingeniería Electromecánica",
  "Ingeniería del Medio Ambiente y Energías Alternativas",
  "Ingeniería de la Producción",
  "Ingeniería de Sistemas",
  "Ingeniería de Petróleo y Gas Natural",
  "Ingeniería de Sistemas Electrónicos y Telecomunicaciones",
  "Ingeniería Industrial y de Sistemas",
  "Inteligencia Artificial",
  // FACED
  "Administración de Empresas",
  "Analítica Gerencial de Datos",
  "Economía",
  "Ingeniería Comercial",
  "Ingeniería Financiera",
  "Marketing y Logística",
  "Relaciones y Negocios Internacionales",
  "Derecho",
  "Psicología Organizacional",
];

// Tipos para las grandes facultades
export type FacultadGrande = "FIA" | "FACED";

// Clasificación de carreras por FIA (Ingeniería y Arquitectura) y FACED
export const CARRERAS_FIA: Carrera[] = [
  "Arquitectura",
  "Ingeniería Civil",
  "Ingeniería Electromecánica",
  "Ingeniería del Medio Ambiente y Energías Alternativas",
  "Ingeniería de la Producción",
  "Ingeniería de Sistemas",
  "Ingeniería de Petróleo y Gas Natural",
  "Ingeniería de Sistemas Electrónicos y Telecomunicaciones",
  "Ingeniería Industrial y de Sistemas",
  "Inteligencia Artificial",
];

export const CARRERAS_FACED: Carrera[] = [
  "Administración de Empresas",
  "Analítica Gerencial de Datos",
  "Economía",
  "Ingeniería Comercial",
  "Ingeniería Financiera",
  "Marketing y Logística",
  "Relaciones y Negocios Internacionales",
  "Derecho",
  "Psicología Organizacional",
];

// Función para obtener la facultad grande de una carrera
export function getFacultadGrande(carrera: string): FacultadGrande {
  // Verificar si es una ingeniería o arquitectura
  const carreraLower = carrera.toLowerCase();
  
  // Lista de palabras clave para FIA
  const palabrasFIA = ['ingeniería', 'ingenieria', 'arquitectura', 'inteligencia artificial'];
  
  // Excepciones que van a FACED aunque contengan "ingeniería"
  const excepcionesFACED = ['ingeniería comercial', 'ingenieria comercial', 'ingeniería financiera', 'ingenieria financiera'];
  
  // Verificar excepciones primero
  if (excepcionesFACED.some(exc => carreraLower.includes(exc))) {
    return "FACED";
  }
  
  // Verificar si es de FIA por las listas oficiales
  if (CARRERAS_FIA.includes(carrera as Carrera)) {
    return "FIA";
  }
  
  // Verificar por palabras clave
  if (palabrasFIA.some(palabra => carreraLower.includes(palabra))) {
    return "FIA";
  }
  
  // Por defecto, FACED
  return "FACED";
}

export const CARRERAS_POR_FACULTAD: Record<Facultad, Carrera[]> = {
  "Ingeniería y Tecnología": [
    "Ingeniería Civil",
    "Ingeniería Electromecánica",
    "Ingeniería del Medio Ambiente y Energías Alternativas",
    "Ingeniería de la Producción",
    "Ingeniería de Sistemas",
    "Ingeniería de Petróleo y Gas Natural",
    "Ingeniería de Sistemas Electrónicos y Telecomunicaciones",
    "Ingeniería Industrial y de Sistemas",
    "Inteligencia Artificial",
  ],
  "Economía y Negocios": [
    "Administración de Empresas",
    "Analítica Gerencial de Datos",
    "Economía",
    "Ingeniería Comercial",
    "Ingeniería Financiera",
    "Marketing y Logística",
    "Relaciones y Negocios Internacionales",
    "Psicología Organizacional",
  ],
  "Ciencias Sociales": [],
  "Diseño y Arquitectura": [
    "Arquitectura",
  ],
  "Ciencias de la Salud": [],
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
    carrera: "Arquitectura",
    date: Date.now() - 1000 * 60 * 300,
    likes: 1,
    nexo: "Anónimo",
    image: require("../../assets/icon.png"),
  },
  {
  id: 300,
    content: "Vi un perrito en la cafetería y me alegró el día.",
    category: "random",
    carrera: "Marketing y Logística",
    date: Date.now() - 1000 * 60 * 300,
    likes: 1,
    nexo: "Anónimo",
    image: require("../../assets/icon.png"),
  },
  {
        id: 4,
        content: "A veces estudio más en la cafetería que en mi casa.",
        category: "academico",
        carrera: "Psicología Organizacional",
        date: Date.now(),
        likes: 0,
        nexo: "Anónimo",
      },
      {
        id: 5,
        content: "Siempre llego tarde pero aún así me dejan entrar 😅",
        category: "random",
        carrera: "Derecho",
        date: Date.now(),
        likes: 1,
        nexo: "Anónimo",
      },
      {
        id: 6,
        content: "Me gusta mi compañero de grupo, pero es muy distraído.",
        category: "amor",
        carrera: "Ingeniería Civil",
        date: Date.now(),
        likes: 2,
        nexo: "Anónimo",
      },

{
  id: 10,
  content: "Confieso que me gusta alguien de mi grupo pero temo arruinar la amistad.",
  category: "amor",
  carrera: "Psicología Organizacional",
  date: Date.now(),
  likes: 0,
  nexo: "Anónimo",
},
{
  id: 11,
  content: "Estudié toda la noche y el examen era de temas diferentes 😭.",
  category: "academico",
  carrera: "Ingeniería de Sistemas",
  date: Date.now(),
  likes: 1,
  nexo: "Anónimo",
},
{
  id: 12,
  content: "A veces me siento más productivo en la biblioteca que en casa.",
  category: "academico",
  carrera: "Administración de Empresas",
  date: Date.now(),
  likes: 0,
  nexo: "Anónimo",
},
{
  id: 13,
  content: "Vi a un profe comiendo solo y me dio ganas de acompañarlo.",
  category: "random",
  carrera: "Inteligencia Artificial",
  date: Date.now(),
  likes: 2,
  nexo: "Anónimo",
},
{
  id: 14,
  content: "Me enamoré de alguien que solo veo en clases virtuales.",
  category: "amor",
  carrera: "Economía",
  date: Date.now(),
  likes: 3,
  nexo: "Anónimo",
},
{
  id: 15,
  content: "Siempre digo que empezaré mis trabajos temprano y nunca lo hago.",
  category: "confesion",
  carrera: "Arquitectura",
  date: Date.now(),
  likes: 4,
  nexo: "Anónimo",
},
{
  id: 16,
  content: "A veces participo en clase solo para que el profe no me baje puntos.",
  category: "confesion",
  carrera: "Derecho",
  date: Date.now(),
  likes: 0,
  nexo: "Anónimo",
},
{
  id: 17,
  content: "Un día llevé mi almuerzo y alguien se lo comió del microondas 😡.",
  category: "random",
  carrera: "Enfermería",
  date: Date.now(),
  likes: 5,
  nexo: "Anónimo",
},
{
  id: 18,
  content: "Confieso que reviso mis notas cada hora cuando salen los resultados.",
  category: "confesion",
  carrera: "Marketing",
  date: Date.now(),
  likes: 2,
  nexo: "Anónimo",
},
{
  id: 19,
  content: "Me gusta ayudar a mis compañeros, pero a veces me aprovechan.",
  category: "confesion",
  carrera: "Psicología",
  date: Date.now(),
  likes: 1,
  nexo: "Anónimo",
},
{
  id: 20,
  content: "Me encanta mi carrera, pero a veces dudo si elegí la correcta.",
  category: "confesion",
  carrera: "Trabajo Social",
  date: Date.now(),
  likes: 3,
  nexo: "Anónimo",
},
{
  id: 21,
  content: "Me dormí en clase y el profe me preguntó justo en ese momento.",
  category: "random",
  carrera: "Derecho",
  date: Date.now(),
  likes: 4,
  nexo: "Anónimo",
},
{
  id: 22,
  content: "Confieso que me pongo nervioso cuando tengo que exponer.",
  category: "confesion",
  carrera: "Comunicación",
  date: Date.now(),
  likes: 2,
  nexo: "Anónimo",
},
{
  id: 23,
  content: "Mi crush me pidió ayuda con una tarea, fue el mejor día de la semana.",
  category: "amor",
  carrera: "Administración de Empresas",
  date: Date.now(),
  likes: 5,
  nexo: "Anónimo",
},
{
  id: 24,
  content: "Siempre me olvido mi carnet cuando hay controles.",
  category: "random",
  carrera: "Medicina",
  date: Date.now(),
  likes: 1,
  nexo: "Anónimo",
},
{
  id: 25,
  content: "Confieso que no entiendo nada de estadística pero finjo que sí.",
  category: "academico",
  carrera: "Contaduría Pública",
  date: Date.now(),
  likes: 3,
  nexo: "Anónimo",
},
{
  id: 26,
  content: "Quise impresionar a alguien y terminé haciendo el ridículo.",
  category: "amor",
  carrera: "Diseño Gráfico",
  date: Date.now(),
  likes: 2,
  nexo: "Anónimo",
},
{
  id: 27,
  content: "Confieso que me gusta estudiar con música a todo volumen.",
  category: "confesion",
  carrera: "Ingeniería Industrial",
  date: Date.now(),
  likes: 0,
  nexo: "Anónimo",
},
{
  id: 28,
  content: "Cada vez que hay presentaciones, invento excusas para no hablar.",
  category: "confesion",
  carrera: "Derecho",
  date: Date.now(),
  likes: 4,
  nexo: "Anónimo",
},
{
  id: 29,
  content: "Me emociono más con los feriados que con los cumpleaños.",
  category: "random",
  carrera: "Psicología",
  date: Date.now(),
  likes: 1,
  nexo: "Anónimo",
},
{
  id: 30,
  content: "Confieso que me da miedo graduarme y no saber qué hacer.",
  category: "confesion",
  carrera: "Arquitectura",
  date: Date.now(),
  likes: 5,
  nexo: "Anónimo",
},
{
  id: 31,
  content: "Siempre me toca el peor compañero de grupo.",
  category: "academico",
  carrera: "Ingeniería Civil",
  date: Date.now(),
  likes: 3,
  nexo: "Anónimo",
},
{
  id: 32,
  content: "A veces entro a clases solo por la asistencia.",
  category: "confesion",
  carrera: "Administración de Empresas",
  date: Date.now(),
  likes: 2,
  nexo: "Anónimo",
},
{
  id: 33,
  content: "Me hice amigo de alguien solo porque me prestaba apuntes.",
  category: "confesion",
  carrera: "Marketing",
  date: Date.now(),
  likes: 4,
  nexo: "Anónimo",
},
{
  id: 34,
  content: "Confieso que no he leído ninguno de los libros del plan.",
  category: "academico",
  carrera: "Derecho",
  date: Date.now(),
  likes: 1,
  nexo: "Anónimo",
},
{
  id: 35,
  content: "Me gusta más la cafetería que algunas materias.",
  category: "random",
  carrera: "Psicología",
  date: Date.now(),
  likes: 5,
  nexo: "Anónimo",
},
{
  id: 36,
  content: "Confieso que me da miedo hablar con los profes.",
  category: "confesion",
  carrera: "Diseño Gráfico",
  date: Date.now(),
  likes: 0,
  nexo: "Anónimo",
},
{
  id: 37,
  content: "Siempre termino mis tareas al último minuto.",
  category: "academico",
  carrera: "Ingeniería de Sistemas",
  date: Date.now(),
  likes: 2,
  nexo: "Anónimo",
},
{
  id: 38,
  content: "Me gusta ir a clases solo para ver a alguien.",
  category: "amor",
  carrera: "Psicología",
  date: Date.now(),
  likes: 3,
  nexo: "Anónimo",
},
{
  id: 39,
  content: "Confieso que tengo miedo al examen final de este semestre.",
  category: "confesion",
  carrera: "Ingeniería Industrial",
  date: Date.now(),
  likes: 1,
  nexo: "Anónimo",
},
{
  id: 40,
  content: "Siempre digo que dejaré el celular mientras estudio, pero no puedo.",
  category: "confesion",
  carrera: "Contaduría Pública",
  date: Date.now(),
  likes: 4,
  nexo: "Anónimo",
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
