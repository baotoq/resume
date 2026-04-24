import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { ImageResponse } from "next/og";
import type { ResumeData } from "@/types/resume";

export const alt = "To Quoc Bao — Senior Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "src/data/resume.md"),
    "utf-8",
  );
  const { data } = matter(raw);
  const resume = data as ResumeData;

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
        backgroundColor: "#fafaf9",
        backgroundImage:
          "radial-gradient(ellipse at top right, rgba(20, 184, 166, 0.25), transparent 60%), radial-gradient(ellipse at bottom left, rgba(16, 185, 129, 0.18), transparent 55%)",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#0f766e",
        }}
      >
        Resume
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            color: "#0a0a0a",
          }}
        >
          {resume.name}
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 600,
            color: "#44403c",
          }}
        >
          {resume.title}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          fontSize: 24,
          color: "#57534e",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: "linear-gradient(135deg, #14b8a6, #10b981)",
          }}
        />
        <div>.NET · Go · Kubernetes · Distributed Systems</div>
      </div>
    </div>,
    size,
  );
}
