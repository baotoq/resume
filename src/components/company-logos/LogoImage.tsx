/** biome-ignore-all lint/performance/noImgElement: external logo URLs from resume data */

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

const logoAnchorClass =
  "transition-transform hover:scale-[1.1] duration-200 ease-out motion-reduce:transition-none motion-reduce:transform-none inline-block rounded-sm outline-hidden focus-visible:outline focus-visible:outline-primary focus-visible:outline-offset-2";

export function LogoImage({ link, logoUrl, company }: LogoImageProps) {
  const LogoComponent = COMPANY_LOGO_MAP[company];

  if (LogoComponent) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${company} (opens in new tab)`}
        className={logoAnchorClass}
      >
        <LogoComponent width={150} height={45} />
      </a>
    );
  }
  return (
    <div className="flex items-center h-12">
      <a
        className={logoAnchorClass}
        target="_blank"
        rel="noopener noreferrer"
        href={link}
        aria-label={`${company} (opens in new tab)`}
      >
        <img src={logoUrl} alt={company} width={150} loading="lazy" />
      </a>
    </div>
  );
}
