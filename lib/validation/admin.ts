import { z } from "zod";
import { UNITS } from "@/lib/constants";

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Digite seu usuário."),
  password: z.string().min(1, "Digite sua senha."),
});

export const dashboardFiltersSchema = z.object({
  unit: z.enum(UNITS).optional(),
  from: z.string().datetime().optional().or(z.literal("")),
  to: z.string().datetime().optional().or(z.literal("")),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(["created_at.desc", "created_at.asc"]).default("created_at.desc"),
  q: z.string().trim().max(180).optional().or(z.literal("")),
});

export type DashboardFilters = z.infer<typeof dashboardFiltersSchema>;
