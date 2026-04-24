import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { ResumeData } from "@/types/resume";

export function parseResumeString(raw: string): ResumeData {
  const { data } = matter(raw);
  return data as ResumeData;
}

export function parseResumeFile(filePath?: string): ResumeData {
  const resolved = filePath ?? path.join(process.cwd(), "src/data/resume.md");
  const raw = fs.readFileSync(resolved, "utf-8");
  return parseResumeString(raw);
}
