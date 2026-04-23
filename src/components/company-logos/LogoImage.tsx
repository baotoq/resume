/** biome-ignore-all lint/performance/noImgElement: <explanation> */
interface LogoImageProps extends React.HTMLAttributes<HTMLDivElement> {
  link: string;
  logoUrl: string;
  company: string;
}

export function LogoImage({ link, logoUrl, company }: LogoImageProps) {
  return (
    <a className="logo" target="_blank" rel="noopener noreferrer" href={link}>
      <img src={logoUrl} alt={company} width={200} />
    </a>
  );
}
