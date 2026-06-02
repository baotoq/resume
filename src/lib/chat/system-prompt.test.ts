import { describe, expect, it } from "vitest";
import type { ResumeData } from "@/lib/resume-schema";
import { buildSystemPrompt } from "./system-prompt";

const resume: ResumeData = {
  name: "Test Person",
  title: "Senior Engineer",
  github: "https://github.com/test",
  linkedin: "https://linkedin.com/in/test",
  website: "https://test.dev",
  bio: "Builder of distributed systems.",
  experience: [
    {
      company: "Acme",
      role: "Senior Engineer",
      startDate: "2021-10",
      endDate: null,
      description: "A startup.",
      logo_url: "/acme.svg",
      link: "https://acme.example",
      tech_stack: ["Go", "Kubernetes"],
      bullets: ["Built a high-throughput service."],
    },
  ],
  skills: { "Cloud & DevOps": "AWS, Kubernetes, Docker" },
  education: [
    {
      degree: "BSc Computer Science",
      institution: "Some University",
      startDate: "2014-09",
      endDate: "2018-06",
    },
  ],
  certifications: [
    {
      name: "KCNA",
      issuer: "The Linux Foundation",
      issuedDate: "2026-05",
    },
  ],
};

describe("buildSystemPrompt", () => {
  it("establishes the first-person Bao persona", () => {
    const prompt = buildSystemPrompt(resume);
    expect(prompt).toMatch(/first person/i);
    expect(prompt).toContain(resume.name);
  });

  it("instructs plain prose with no markdown", () => {
    const prompt = buildSystemPrompt(resume);
    expect(prompt).toMatch(/plain prose/i);
    expect(prompt).toMatch(/markdown/i);
  });

  it("instructs declining off-topic and harmful content", () => {
    const prompt = buildSystemPrompt(resume);
    expect(prompt).toMatch(/decline/i);
    expect(prompt).toMatch(/off-topic/i);
    expect(prompt).toMatch(/harmful/i);
  });

  it("instructs ignoring embedded instructions and never fabricating", () => {
    const prompt = buildSystemPrompt(resume);
    expect(prompt).toMatch(/ignore/i);
    expect(prompt).toMatch(/never fabricate/i);
  });

  it("includes the resume facts it is grounded on", () => {
    const prompt = buildSystemPrompt(resume);
    expect(prompt).toContain("Acme");
    expect(prompt).toContain("Built a high-throughput service.");
    expect(prompt).toContain("AWS, Kubernetes, Docker");
    expect(prompt).toContain(resume.github);
    expect(prompt).toContain(resume.linkedin);
  });

  it("does NOT contain the EMAIL/PHONE env values (PII invariant)", () => {
    // buildSystemPrompt takes only ResumeData and must never read process.env.
    // Sentinels that, if leaked, would be unmistakable in the output.
    const emailSentinel = "secret-email@example.com";
    const phoneSentinel = "+15555550123";
    process.env.EMAIL = emailSentinel;
    process.env.PHONE = phoneSentinel;
    try {
      const prompt = buildSystemPrompt(resume);
      expect(prompt).not.toContain(emailSentinel);
      expect(prompt).not.toContain(phoneSentinel);
    } finally {
      process.env.EMAIL = undefined;
      process.env.PHONE = undefined;
    }
  });
});
