import { z } from "zod";
import { questions } from "@/lib/questions";
import { UNITS } from "@/lib/constants";

const answerValueSchema = z.union([z.number().int().min(0).max(10), z.null()]);

const answersSchema = z
  .record(z.string(), answerValueSchema)
  .refine((answers) => questions.every((q) => q.id in answers), {
    message: "Faltan respuestas por calificar.",
  });

export const submissionSchema = z.object({
  submissionId: z.string().uuid(),
  unit: z.enum(UNITS),
  answers: answersSchema,
  name: z
    .string()
    .trim()
    .max(120, "El nombre es demasiado largo.")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .trim()
    .max(180)
    .email("El correo no tiene un formato válido.")
    .optional()
    .or(z.literal("")),
  anonymous: z.boolean().optional(),
  comments: z.record(z.string(), z.string().trim().max(1000)).optional(),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;
