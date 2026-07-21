import { z } from "zod";
import { questions } from "@/lib/questions";
import { UNITS } from "@/lib/constants";

const answerValueSchema = z.union([
  z.number().int().min(0).max(10),
  z.string().trim().max(200),
  z.null(),
]);

const answersSchema = z
  .record(z.string(), answerValueSchema)
  .superRefine((answers, ctx) => {
    for (const q of questions) {
      const value = answers[q.id];

      if (!(q.id in answers) || value === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Faltan respuestas por calificar.",
        });
        continue;
      }

      if (q.type === "choice") {
        if (typeof value !== "string" || value.trim().length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Falta responder: ${q.label}`,
          });
        }
      } else if (value !== null && typeof value !== "number") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Respuesta inválida para: ${q.label}`,
        });
      }
    }
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
