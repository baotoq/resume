import { z } from "zod";

const yearMonth = z.string().regex(/^\d{4}-\d{2}$/, "expected YYYY-MM");

export const ExperienceEntrySchema = z
  .object({
    company: z.string().min(1),
    role: z.string().min(1),
    startDate: yearMonth,
    endDate: yearMonth.nullable(),
    description: z.string().optional(),
    bullets: z.array(z.string().min(1)).min(1),
    logo_url: z.string().min(1),
    link: z.string().min(1),
    tech_stack: z.array(z.string()).optional(),
    images: z.array(z.string().min(1)).optional(),
  })
  .strict();

export const EducationEntrySchema = z
  .object({
    degree: z.string().min(1),
    institution: z.string().min(1),
    startDate: yearMonth,
    endDate: yearMonth.nullable(),
    details: z.string().optional(),
    logo_url: z.string().optional(),
    link: z.string().optional(),
  })
  .strict();

export const CertificationEntrySchema = z
  .object({
    name: z.string().min(1),
    abbrev: z.string().max(4).optional(),
    issuer: z.string().min(1),
    year: z.number().int(),
    url: z.string().optional(),
  })
  .strict();

export const ResumeSchema = z
  .object({
    name: z.string().min(1),
    title: z.string().min(1),
    github: z.string().min(1),
    linkedin: z.string().min(1),
    experience: z.array(ExperienceEntrySchema),
    skills: z.record(z.string(), z.string()),
    bio: z.string().optional(),
    education: z.array(EducationEntrySchema).optional(),
    certifications: z.array(CertificationEntrySchema).optional(),
  })
  .strict();

export type ResumeData = z.infer<typeof ResumeSchema>;
export type ExperienceEntry = z.infer<typeof ExperienceEntrySchema>;
export type EducationEntry = z.infer<typeof EducationEntrySchema>;
export type CertificationEntry = z.infer<typeof CertificationEntrySchema>;
