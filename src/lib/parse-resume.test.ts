import { describe, expect, it } from "vitest";
import { parseResumeFile, parseResumeString } from "./parse-resume";

describe("parseResumeFile — real resume.md schema guard", () => {
  const resume = parseResumeFile();

  it("has required top-level string fields", () => {
    expect(typeof resume.name).toBe("string");
    expect(resume.name.length).toBeGreaterThan(0);
    expect(typeof resume.title).toBe("string");
    expect(typeof resume.github).toBe("string");
    expect(typeof resume.linkedin).toBe("string");
  });

  it("has a non-empty experience array", () => {
    expect(Array.isArray(resume.experience)).toBe(true);
    expect(resume.experience.length).toBeGreaterThan(0);
  });

  it("every experience entry has the required fields", () => {
    for (const [i, entry] of resume.experience.entries()) {
      expect(typeof entry.company, `experience[${i}].company`).toBe("string");
      expect(typeof entry.role, `experience[${i}].role`).toBe("string");
      expect(typeof entry.startDate, `experience[${i}].startDate`).toBe(
        "string",
      );
      expect(
        entry.endDate === null || typeof entry.endDate === "string",
        `experience[${i}].endDate`,
      ).toBe(true);
      expect(Array.isArray(entry.bullets), `experience[${i}].bullets`).toBe(
        true,
      );
      expect(typeof entry.logo_url, `experience[${i}].logo_url`).toBe("string");
      expect(typeof entry.link, `experience[${i}].link`).toBe("string");
    }
  });

  it("skills is a Record<string, string>", () => {
    expect(typeof resume.skills).toBe("object");
    expect(resume.skills).not.toBeNull();
    for (const [key, value] of Object.entries(resume.skills)) {
      expect(typeof key).toBe("string");
      expect(typeof value).toBe("string");
    }
  });
});

describe("parseResumeString — fixtures", () => {
  it("parses minimal valid frontmatter", () => {
    const raw = `---
name: Jane Doe
title: Engineer
github: https://github.com/jane
linkedin: https://linkedin.com/in/jane
experience: []
skills: {}
---
`;
    const data = parseResumeString(raw);
    expect(data.name).toBe("Jane Doe");
    expect(data.experience).toEqual([]);
    expect(data.skills).toEqual({});
  });

  it("allows empty skills record", () => {
    const raw = `---
name: X
title: Y
github: g
linkedin: l
experience: []
skills: {}
---
`;
    const data = parseResumeString(raw);
    expect(data.skills).toEqual({});
  });

  it("throws on malformed YAML", () => {
    const raw = `---
name: "unterminated
---
`;
    expect(() => parseResumeString(raw)).toThrow();
  });

  it("returns empty object shape when frontmatter absent", () => {
    const data = parseResumeString("no frontmatter here");
    expect(data).toEqual({});
  });
});
