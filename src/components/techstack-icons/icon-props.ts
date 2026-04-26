export type SizedIconProps = { size?: number | string };

export const resolveSize = (size: number | string = 40): number =>
  typeof size === "number" ? size : parseFloat(size);
