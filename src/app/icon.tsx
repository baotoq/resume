import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #14b8a6, #10b981)",
        color: "#fff",
        fontSize: 22,
        fontWeight: 800,
        fontFamily: "system-ui, sans-serif",
        borderRadius: 6,
      }}
    >
      B
    </div>,
    size,
  );
}
