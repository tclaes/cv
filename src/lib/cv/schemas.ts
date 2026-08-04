import { z } from "zod";

export function parseCsv(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseBullets(value: string): string[] {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

// --- Storage schemas: validated server-side, array fields as they're stored in Firestore.

export const jobSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  company: z.string().min(1),
  location: z.string().optional(),
  periodStart: z.string().min(1),
  periodEnd: z.string().min(1),
  bullets: z.array(z.string()),
  skills: z.array(z.string()),
});
export type JobPayload = z.infer<typeof jobSchema>;

export const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  employer: z.string().min(1),
  periodStart: z.string().optional().default(""),
  periodEnd: z.string().optional().default(""),
  bullets: z.array(z.string()),
  tech: z.array(z.string()),
  visibility: z.enum(["public", "private"]),
});
export type ProjectPayload = z.infer<typeof projectSchema>;

export const certificationSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  issuer: z.string().min(1),
  date: z.string().optional().default(""),
  credentialUrl: z.string().optional(),
});
export type CertificationPayload = z.infer<typeof certificationSchema>;

export const skillCategorySchema = z.object({
  id: z.string().optional(),
  category: z.string().min(1),
  items: z.array(z.string()),
});
export type SkillCategoryPayload = z.infer<typeof skillCategorySchema>;

// --- Form schemas: used client-side with react-hook-form + zodResolver. Bullets/tech/skills
// stay as raw strings here (one bullet per line / comma-separated) and are split into arrays
// right before calling the server action — see parseCsv/parseBullets above.

export const jobFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Verplicht"),
  company: z.string().min(1, "Verplicht"),
  location: z.string().optional(),
  periodStart: z.string().min(1, "Verplicht"),
  periodEnd: z.string().min(1, "Verplicht"),
  bullets: z.string(),
  skills: z.string(),
});
export type JobFormValues = z.infer<typeof jobFormSchema>;

export const projectFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Verplicht"),
  employer: z.string().min(1, "Verplicht"),
  periodStart: z.string().optional(),
  periodEnd: z.string().optional(),
  bullets: z.string(),
  tech: z.string(),
  visibility: z.enum(["public", "private"]),
});
export type ProjectFormValues = z.infer<typeof projectFormSchema>;

export const certificationFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Verplicht"),
  issuer: z.string().min(1, "Verplicht"),
  date: z.string().optional(),
  credentialUrl: z.string().optional(),
});
export type CertificationFormValues = z.infer<typeof certificationFormSchema>;

export const skillCategoryFormSchema = z.object({
  id: z.string().optional(),
  category: z.string().min(1, "Verplicht"),
  items: z.string(),
});
export type SkillCategoryFormValues = z.infer<typeof skillCategoryFormSchema>;
