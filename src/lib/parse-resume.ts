import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { type ResumeData, ResumeSchema } from "@/lib/resume-schema";

export function parseResumeString(raw: string): ResumeData {
  const { data } = matter(raw);
  const result = ResumeSchema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => (i.path.length ? `${i.path.join(".")}: ${i.message}` : i.message))
      .join("\n");
    throw new Error(`Invalid resume frontmatter:\n${issues}`);
  }
  return result.data;
}

export function parseResumeFile(filePath?: string): ResumeData {
  const resolved = filePath ?? path.join(process.cwd(), "src/data/resume.md");
  const raw = fs.readFileSync(resolved, "utf-8");
  return parseResumeString(raw);
}
