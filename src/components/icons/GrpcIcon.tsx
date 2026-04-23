interface GrpcIconProps {
  size?: number | string;
}

export function GrpcIcon({ size = 40 }: GrpcIconProps) {
  const w = typeof size === "number" ? size : parseFloat(size as string);
  return (
    <svg
      width={w}
      height={w}
      viewBox="0 0 66 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>gRPC</title>
      {/* Left large diamond */}
      <polygon points="14,4 26,18 14,32 2,18" fill="#00B5B1" />
      {/* Right small diamond */}
      <polygon points="58,10 66,18 58,26 50,18" fill="#00B5B1" />
      {/* Arrow → (top, pointing right) */}
      <line x1="28" y1="15" x2="48" y2="15" stroke="#244B5A" strokeWidth="2" />
      <polygon points="50,15 44,11 44,19" fill="#244B5A" />
      {/* Arrow ← (bottom, pointing left) */}
      <line x1="22" y1="21" x2="42" y2="21" stroke="#244B5A" strokeWidth="2" />
      <polygon points="20,21 26,17 26,25" fill="#244B5A" />
      {/* gRPC text */}
      <text
        x="35"
        y="48"
        textAnchor="middle"
        fill="#244B5A"
        fontSize="14"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
      >
        gRPC
      </text>
    </svg>
  );
}
