import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, "..", "src", "app", "opengraph-image.png");

const WIDTH = 1200;
const HEIGHT = 630;

const skills = ["C#", "TypeScript", "Golang", "Kubernetes", "AWS", "Azure"];

async function fetchFont(): Promise<ArrayBuffer> {
  const url = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap";
  const css = await fetch(url).then((r) => r.text());
  const fontUrlMatch = css.match(/src:\s*url\(([^)]+)\)\s*format\('(?:woff2|truetype)'\)/);
  if (!fontUrlMatch) {
    throw new Error("Could not extract font URL from Google Fonts CSS");
  }
  const fontData = await fetch(fontUrlMatch[1]).then((r) => r.arrayBuffer());
  return fontData;
}

async function generate() {
  console.log("Fetching Plus Jakarta Sans font...");
  const fontData = await fetchFont();

  console.log("Rendering OG image with satori...");
  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
          background: "linear-gradient(135deg, #FAFAF8 0%, #F0EDE8 100%)",
          fontFamily: "Plus Jakarta Sans",
        },
        children: [
          // Teal accent bar at top
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "6px",
                background: "linear-gradient(90deg, #0D9488 0%, #2DD4BF 100%)",
              },
            },
          },
          // Decorative teal circle
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                top: "-80px",
                right: "-80px",
                width: "300px",
                height: "300px",
                borderRadius: "50%",
                background: "rgba(13, 148, 136, 0.06)",
              },
            },
          },
          // Name
          {
            type: "div",
            props: {
              style: {
                fontSize: "64px",
                fontWeight: 700,
                color: "#1C1917",
                lineHeight: 1.1,
                marginBottom: "12px",
              },
              children: "To Quoc Bao",
            },
          },
          // Title
          {
            type: "div",
            props: {
              style: {
                fontSize: "32px",
                fontWeight: 600,
                color: "#0D9488",
                marginBottom: "48px",
              },
              children: "Senior Software Engineer",
            },
          },
          // Divider line
          {
            type: "div",
            props: {
              style: {
                width: "80px",
                height: "3px",
                background: "#0D9488",
                marginBottom: "36px",
                borderRadius: "2px",
              },
            },
          },
          // Skills row
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
              },
              children: skills.map((skill) => ({
                type: "div",
                props: {
                  style: {
                    padding: "8px 20px",
                    borderRadius: "20px",
                    background: "rgba(13, 148, 136, 0.1)",
                    border: "1px solid rgba(13, 148, 136, 0.2)",
                    fontSize: "18px",
                    fontWeight: 500,
                    color: "#0D9488",
                  },
                  children: skill,
                },
              })),
            },
          },
          // Bottom URL hint
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                bottom: "32px",
                right: "80px",
                fontSize: "16px",
                color: "#A8A29E",
                fontWeight: 400,
              },
              children: "baotoq.github.io/resume",
            },
          },
        ],
      },
    },
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        {
          name: "Plus Jakarta Sans",
          data: fontData,
          weight: 400,
          style: "normal",
        },
        {
          name: "Plus Jakarta Sans",
          data: fontData,
          weight: 600,
          style: "normal",
        },
        {
          name: "Plus Jakarta Sans",
          data: fontData,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );

  console.log("Converting SVG to PNG with resvg...");
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: WIDTH },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  writeFileSync(OUTPUT_PATH, pngBuffer);
  const sizeKB = Math.round(pngBuffer.length / 1024);
  console.log(`OG image generated: ${OUTPUT_PATH} (${sizeKB} KB)`);
}

generate().catch((err) => {
  console.error("Failed to generate OG image:", err);
  process.exit(1);
});
