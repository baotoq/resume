interface GrpcIconProps {
  size?: number | string;
}

export function GrpcIcon({ size = 40 }: GrpcIconProps) {
  const w = typeof size === "number" ? size : parseFloat(size as string);
  return (
    <svg
      width={w}
      height={w}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>gRPC</title>
      {/* Left large diamond */}
      <polygon points="18,10 36,30 18,50 2,30" fill="#00B5B1" />
      {/* Right small diamond */}
      <polygon points="70,20 80,30 70,40 60,30" fill="#00B5B1" />
      {/* Arrow → (top, pointing right) */}
      <line x1="38" y1="25" x2="58" y2="25" stroke="#244B5A" strokeWidth="2.5" />
      <polygon points="60,25 53,20 53,30" fill="#244B5A" />
      {/* Arrow ← (bottom, pointing left) */}
      <line x1="26" y1="35" x2="48" y2="35" stroke="#244B5A" strokeWidth="2.5" />
      <polygon points="24,35 31,30 31,40" fill="#244B5A" />
      {/* gRPC text */}
      <text
        x="40"
        y="75"
        textAnchor="middle"
        fill="#244B5A"
        fontSize="18"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
      >
        gRPC
      </text>
    </svg>
  );
}
