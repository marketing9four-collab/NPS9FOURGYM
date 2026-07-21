export type QuestionType = "rating" | "nps" | "choice";

export interface Question {
  id: string;
  label: string;
  type: QuestionType;
  /** Solo para type: "choice" — opciones fijas que se muestran como botones. */
  options?: string[];
  /** Solo para type: "choice" — agrega un botón "Otra" con campo de texto libre. */
  allowOther?: boolean;
}

// Estructura fácil de mantener: agrega/edita preguntas aquí, no en los componentes.
// type: "nps" queda reservado para cuando exista la pregunta de recomendación
// ("¿Qué tan probable es que recomiendes 9FOURGYM?"); hasta entonces todas son "rating".
export const questions: Question[] = [
  { id: "recepcion", label: "Atención en recepción", type: "rating" },
  { id: "equipos", label: "Equipos y accesorios", type: "rating" },
  { id: "limpieza", label: "Higiene, limpieza y organización de nuestras instalaciones", type: "rating" },
  { id: "banos", label: "Limpieza y mantenimiento de los baños", type: "rating" },
  { id: "clases_colectivas", label: "Clases grupales y spinning", type: "rating" },
  { id: "entrenadores", label: "Profesores y entrenadores", type: "rating" },
  { id: "gerencia", label: "Gerencia de la unidad", type: "rating" },
  { id: "estacionamiento", label: "Estacionamiento", type: "rating" },
  {
    id: "recomendacion",
    label: "¿Qué tan probable es que nos recomiendes a un amigo o compañero?",
    type: "nps",
  },
  {
    id: "red_social",
    label: "¿Qué red social utilizas más?",
    type: "choice",
    options: [
      "TikTok",
      "Instagram",
      "Facebook",
      "YouTube",
      "Kwai",
      "Twitter (X)",
      "Pinterest",
      "No utilizo",
    ],
    allowOther: true,
  },
];

export const hasNpsQuestions = questions.some((q) => q.type === "nps");
