interface DapperIconProps {
  size?: number | string;
}

export function DapperIcon({ size = 40 }: DapperIconProps) {
  const w = typeof size === "number" ? size : parseFloat(size as string);
  return (
    <svg
      width={w}
      height={w}
      viewBox="0 0 64 78"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Dapper</title>
      {/* Orange: top spine half + top arc to arc-midpoint */}
      <path
        d="M 13 32 L 13 8 Q 51 8 51 32"
        stroke="#F7941D"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Pink: bottom spine half + diagonal from spine-bottom to arc-midpoint */}
      <path
        d="M 13 32 L 13 56 L 51 32"
        stroke="#E91E8C"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Teal: inner D arc */}
      <path
        d="M 23 16 Q 46 16 46 32 Q 46 50 23 50"
        stroke="#00BCD4"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <text
        x="32"
        y="76"
        textAnchor="middle"
        fill="#1E293B"
        fontSize="17"
        fontFamily="Arial, sans-serif"
        fontWeight="600"
      >
        Dapper
      </text>
    </svg>
  );
}
