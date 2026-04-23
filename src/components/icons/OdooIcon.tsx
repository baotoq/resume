interface OdooIconProps {
  size?: number | string;
}

export function OdooIcon({ size = 40 }: OdooIconProps) {
  const w = typeof size === "number" ? size : parseFloat(size as string);
  return (
    <svg
      width={w}
      height={w}
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Odoo</title>
      {/* Main circle */}
      <circle cx="25" cy="19" r="18" fill="#714B67" />
      {/* Inner white ring to form O */}
      <circle cx="25" cy="19" r="11" fill="white" />
      {/* Center dot */}
      <circle cx="25" cy="19" r="4.5" fill="#714B67" />
      {/* Odoo label */}
      <text
        x="25"
        y="50"
        textAnchor="middle"
        fill="#714B67"
        fontSize="13"
        fontFamily="Arial, sans-serif"
        fontWeight="600"
      >
        Odoo
      </text>
    </svg>
  );
}
