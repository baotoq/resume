interface OdooIconProps {
  size?: number | string;
}

export function OdooIcon({ size = 40 }: OdooIconProps) {
  const w = typeof size === "number" ? size : parseFloat(size as string);
  const h = Math.round(w * (62 / 50));

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 50 62"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Odoo</title>
      {/* Main circle */}
      <circle cx="25" cy="22" r="20" fill="#714B67" />
      {/* Inner white ring to form O */}
      <circle cx="25" cy="22" r="12" fill="white" />
      {/* Center dot */}
      <circle cx="25" cy="22" r="5" fill="#714B67" />
      {/* Odoo label */}
      <text
        x="25"
        y="58"
        textAnchor="middle"
        fill="#714B67"
        fontSize="11"
        fontFamily="Arial, sans-serif"
        fontWeight="600"
      >
        Odoo
      </text>
    </svg>
  );
}
