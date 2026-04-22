interface EFCoreIconProps {
  size?: number | string;
}

export function EFCoreIcon({ size = 40 }: EFCoreIconProps) {
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
      <title>EF Core</title>
      {/* Hexagon */}
      <polygon
        points="25,2 47,14 47,38 25,50 3,38 3,14"
        fill="#5C2D91"
      />
      {/* EF text inside */}
      <text
        x="25"
        y="34"
        textAnchor="middle"
        fill="white"
        fontSize="18"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
      >
        EF
      </text>
      {/* Core label below */}
      <text
        x="25"
        y="60"
        textAnchor="middle"
        fill="#5C2D91"
        fontSize="10"
        fontFamily="Arial, sans-serif"
        fontWeight="600"
      >
        Core
      </text>
    </svg>
  );
}
