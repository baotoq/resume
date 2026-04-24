interface EFCoreIconProps {
  size?: number | string;
}

export function EFCoreIcon({ size = 40 }: EFCoreIconProps) {
  const w = typeof size === "number" ? size : parseFloat(size as string);
  return (
    <svg
      width={w}
      height={w}
      viewBox="0 0 50 58"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>EF Core</title>
      {/* Hexagon filling viewBox */}
      <polygon points="25,1 49,14 49,43 25,57 1,43 1,14" fill="#5C2D91" />
      {/* EF text inside */}
      <text
        x="25"
        y="31"
        textAnchor="middle"
        fill="white"
        fontSize="20"
        fontFamily="Arial, sans-serif"
        fontWeight="400"
      >
        EF
      </text>
      {/* Core label inside hexagon */}
      <text
        x="25"
        y="45"
        textAnchor="middle"
        fill="white"
        fontSize="12"
        fontFamily="Arial, sans-serif"
        fontWeight="400"
      >
        Core
      </text>
    </svg>
  );
}
