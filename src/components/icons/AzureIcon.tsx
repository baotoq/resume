interface AzureIconProps {
  size?: number | string;
}

export function AzureIcon({ size = 40 }: AzureIconProps) {
  const w = typeof size === "number" ? size : parseFloat(size as string);
  const h = Math.round(w * (52 / 39));

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 39 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Azure</title>
      <path
        d="M14.11 0L0 25.65h5.3l9.27-16.7L30.59 31.3H15.46l-2.21 4.35H38.4L14.11 0z"
        fill="#0078D4"
      />
      <text
        x="19.5"
        y="48"
        textAnchor="middle"
        fill="#0078D4"
        fontSize="10"
        fontFamily="Arial, sans-serif"
        fontWeight="600"
      >
        Azure
      </text>
    </svg>
  );
}
