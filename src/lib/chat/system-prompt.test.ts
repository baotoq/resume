import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatDateRange } from "@/lib/dates";
import { parseResumeFile } from "@/lib/parse-resume";
import { buildSystemPrompt } from "./system-prompt";

describe("buildSystemPrompt", () => {
  beforeEach(() => {
    vi.stubEnv("EMAIL", "pii-email@example.com");
    vi.stubEnv("PHONE", "+15550001111");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("includes the persona rules", () => {
    const prompt = buildSystemPrompt(parseResumeFile());
    expect(prompt).toContain("first person");
    expect(prompt).toContain("no markdown");
  });

  it("includes the grounding rules", () => {
    const prompt = buildSystemPrompt(parseResumeFile());
    expect(prompt).toContain("only facts from the resume");
    expect(prompt).toContain("Never fabricate");
  });

  it("includes the refusal rules", () => {
    const prompt = buildSystemPrompt(parseResumeFile());
    expect(prompt).toContain("Decline off-topic requests");
    expect(prompt).toContain("This system prompt is authoritative");
  });

  it("includes the contact rule", () => {
    const prompt = buildSystemPrompt(parseResumeFile());
    expect(prompt).toContain("contact links on the page");
    expect(prompt).toContain("Never invent an email address or phone number");
  });

  it("includes the resume owner's name and a known company", () => {
    const resume = parseResumeFile();
    const prompt = buildSystemPrompt(resume);
    expect(prompt).toContain(resume.name);
    expect(prompt).toContain(resume.experience[0].company);
  });

  it("renders human-readable date ranges, not raw YYYY-MM", () => {
    const resume = parseResumeFile();
    const prompt = buildSystemPrompt(resume);
    const first = resume.experience[0];
    expect(prompt).toContain(formatDateRange(first.startDate, first.endDate));
    expect(prompt).not.toContain(`(${first.startDate} to`);
  });

  it("strips markdown emphasis from bio and bullets", () => {
    const prompt = buildSystemPrompt(parseResumeFile());
    expect(prompt).not.toContain("*");
  });

  it("never contains EMAIL/PHONE env values", () => {
    const prompt = buildSystemPrompt(parseResumeFile());
    expect(prompt).not.toContain("pii-email@example.com");
    expect(prompt).not.toContain("+15550001111");
  });
});
