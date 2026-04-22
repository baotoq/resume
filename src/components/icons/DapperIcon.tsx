interface DapperIconProps {
  size?: number | string;
}

export function DapperIcon({ size = 40 }: DapperIconProps) {
  const w = typeof size === "number" ? size : parseFloat(size as string);
  const h = Math.round(w * (85 / 68));

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 68 85"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Dapper</title>
      {/* Orange: left spine upper half + top arc of outer D */}
      <path
        d="M 8 8 L 8 32 M 8 8 Q 50 8 52 32"
        stroke="#F7941D"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Pink: lower-left spine + diagonal (outer D bottom portion) */}
      <path
        d="M 8 32 L 8 56 L 22 44"
        stroke="#E91E8C"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Teal: inner D arc (full right-side curve) */}
      <path
        d="M 22 16 Q 60 16 60 36 Q 60 56 22 56"
        stroke="#00BCD4"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      {/* Dapper label */}
      <text
        x="34"
        y="78"
        textAnchor="middle"
        fill="#1E293B"
        fontSize="11"
        fontFamily="Arial, sans-serif"
        fontWeight="600"
      >
        Dapper
      </text>
    </svg>
  );
}
