import { resolveSize, type SizedIconProps } from "./icon-props";

export function ELKIcon({ size }: SizedIconProps) {
  const w = resolveSize(size);
  return (
    <svg
      width={w}
      height={w}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>ELK Stack</title>

      {/* Elasticsearch "e" mark — circle cx=40, cy=34, r=28 */}
      {/* Top half — yellow */}
      <path d="M 12 34 A 28 28 0 0 1 68 34 Z" fill="#FEC514" />
      {/* Bottom half — teal */}
      <path d="M 12 34 A 28 28 0 0 0 68 34 Z" fill="#00BFB3" />
      {/* Dark band — left portion (horizontal bar of "e"), left edge follows circle curve */}
      <path
        d="M 46 27 H 19 Q 12 27 12 34 Q 12 41 19 41 H 46 Z"
        fill="#231F20"
      />
      {/* Blue pill — right portion (opening of "e") */}
      <path
        d="M 46 27 H 62 Q 68 27 68 34 Q 68 41 62 41 H 46 Z"
        fill="#00A9E0"
      />

      {/* ELK label — E=yellow, L=pink, K=teal */}
      <text
        x="40"
        y="80"
        textAnchor="middle"
        fontSize="22"
        fontFamily="Arial, sans-serif"
        fontWeight="600"
      >
        <tspan fill="#E8B005">E</tspan>
        <tspan fill="#F04E98">L</tspan>
        <tspan fill="#00BFB3">K</tspan>
      </text>
    </svg>
  );
}
