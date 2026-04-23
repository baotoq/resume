/** biome-ignore-all lint/performance/noImgElement: <explanation> */

import { CoverGoLogo } from "./CovergoLogo";
import { UpmeshLogo } from "./UpmeshLogo";

interface LogoImageProps extends React.HTMLAttributes<HTMLDivElement> {
  link: string;
  logoUrl: string;
  company: string;
}

const COMPANY_LOGO_MAP: Record<
  string,
  React.FunctionComponent<React.SVGProps<SVGSVGElement>>
> = {
  CoverGo: CoverGoLogo,
  Upmesh: UpmeshLogo,
};

export function LogoImage({ link, logoUrl, company }: LogoImageProps) {
  const LogoComponent = COMPANY_LOGO_MAP[company];

  if (LogoComponent) {
    // Use the SVG component for the specified company to ensure it scales well and looks crisp
    return (
      <a href={link} target="_blank" rel="noopener noreferrer">
        <LogoComponent width={150} height={45} />
      </a>
    );
  }
  // Fallback for other companies
  return (
    <div className="flex items-center h-12">
      <a className="logo" target="_blank" rel="noopener noreferrer" href={link}>
        <img src={logoUrl} alt={company} width={150} />
      </a>
    </div>
  );
}
