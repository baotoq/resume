interface ELKIconProps {
  size?: number | string;
}

export function ELKIcon({ size = 40 }: ELKIconProps) {
  const w = typeof size === "number" ? size : parseFloat(size as string);
  return (
    <svg
      width={w}
      height={w}
      viewBox="0 0 100 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>ELK Stack</title>

      {/* === e (Elasticsearch) — circle cx=16, cy=30, r=15 === */}
      {/* Yellow top dome */}
      <path d="M 1 30 A 15 15 0 0 1 31 30 Z" fill="#F0B429" />
      {/* Teal bottom dome */}
      <path d="M 1 30 A 15 15 0 0 0 31 30 Z" fill="#00BFB3" />
      {/* Black middle-left band (overwrites dome center) */}
      <rect x="1" y="25" width="15" height="10" fill="#231F20" />
      {/* Blue middle-right pill */}
      <path d="M 16 25 H 26 Q 31 25 31 30 Q 31 35 26 35 H 16 Z" fill="#00A9E0" />

      {/* === l (Logstash) — box x=37–65, y=5–55 === */}
      {/* Yellow top */}
      <rect x="37" y="5" width="28" height="26" fill="#F0B429" />
      {/* Black lower-left arch */}
      <path d="M 37 31 Q 51 31 51 55 H 37 Z" fill="#231F20" />
      {/* Teal lower-right */}
      <rect x="51" y="31" width="14" height="24" fill="#00BFB3" />

      {/* === k (Kibana) — box x=71–99, y=5–55 === */}
      {/* Pink upper-right triangle (upper arm of K) */}
      <polygon points="71,5 99,5 99,31" fill="#F04E98" />
      {/* Black lower-left arch */}
      <path d="M 71 31 Q 85 31 85 55 H 71 Z" fill="#231F20" />
      {/* Teal lower-right */}
      <polygon points="85,31 99,31 99,55 85,55" fill="#00BFB3" />

      {/* ELK label */}
      <text
        x="50"
        y="68"
        textAnchor="middle"
        fill="#231F20"
        fontSize="9"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        letterSpacing="1"
      >
        ELK
      </text>
    </svg>
  );
}
