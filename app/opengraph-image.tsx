import { ImageResponse } from "next/og";
export const alt = "ADPoly CyberGuard — Cybersecurity. AI. Innovation.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 80,
        background: "#080e18",
        color: "#f3f6fa",
        borderBottom: "10px solid #60dfef",
      }}
    >
      <div style={{ color: "#60dfef", fontSize: 23, letterSpacing: 5 }}>
        ABU DHABI POLYTECHNIC · UAE
      </div>
      <div style={{ fontSize: 86, fontWeight: 700, marginTop: 42 }}>
        ADPoly CyberGuard
      </div>
      <div style={{ fontSize: 40, color: "#a3b0c1", marginTop: 20 }}>
        Cybersecurity. AI. Innovation.
      </div>
      <div style={{ fontSize: 24, marginTop: 64 }}>
        3rd Place · School of Cyber Defense · GISEC Global 2026
      </div>
    </div>,
    size,
  );
}
