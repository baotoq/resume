import Amazonwebservice from "react-devicons/amazonwebservices/original-wordmark";
import Docker from "react-devicons/docker/original-wordmark";
import Dotnet from "react-devicons/dotnetcore/original";
import Facebook from "react-devicons/facebook/original";
import Github from "react-devicons/github/original-wordmark";
import Go from "react-devicons/go/original";
import Grafana from "react-devicons/grafana/original-wordmark";
import Graphql from "react-devicons/graphql/plain";
import Kubernetes from "react-devicons/kubernetes/plain";
import Microsoftsqlserver from "react-devicons/microsoftsqlserver/plain-wordmark";
import Mongodb from "react-devicons/mongodb/original-wordmark";
import Mysql from "react-devicons/mysql/original";
import Neo4j from "react-devicons/neo4j/original-wordmark";
import Postgresql from "react-devicons/postgresql/original-wordmark";
import ReactIcon from "react-devicons/react/original-wordmark";
import Redis from "react-devicons/redis/original-wordmark";
import Tailwindcss from "react-devicons/tailwindcss/original";
import Terraform from "react-devicons/terraform/original-wordmark";
import Typescript from "react-devicons/typescript/original";
import Vuejs from "react-devicons/vuejs/original-wordmark";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AzureIcon } from "./AzureIcon";
import { DapperIcon } from "./DapperIcon";
import { DaprIcon } from "./DaprIcon";
import { EFCoreIcon } from "./EFCoreIcon";
import { ELKIcon } from "./ELKIcon";
import { FluxCDIcon } from "./FluxCDIcon";
import { GrpcIcon } from "./GrpcIcon";
import type { SizedIconProps } from "./icon-props";
import { OdooIcon } from "./OdooIcon";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TooltipWrapper } from "./TooltipWrapper";

interface TechStackIconsProps {
  stack?: string[];
  className?: string;
}

type IconComponent = React.FunctionComponent<SizedIconProps>;

const REACT_BLUE = "#0380A2";

const TECH_ICON_MAP: Record<string, IconComponent> = {
  go: Go,
  ".net": Dotnet,
  kubernetes: Kubernetes,
  terraform: Terraform,
  docker: Docker,
  grafana: Grafana,
  github: Github,
  aws: Amazonwebservice,
  azure: AzureIcon,
  typescript: Typescript,
  graphql: Graphql,
  postgresql: Postgresql,
  mongodb: Mongodb,
  neo4j: Neo4j,
  redis: Redis,
  mysql: Mysql,
  mssql: Microsoftsqlserver,
  react: ({ size }) => <ReactIcon size={size} color={REACT_BLUE} />,
  vue: Vuejs,
  tailwindcss: Tailwindcss,
  facebook: Facebook,
  dapr: DaprIcon,
  dapper: DapperIcon,
  "ef core": EFCoreIcon,
  "elk stack": ELKIcon,
  fluxcd: FluxCDIcon,
  grpc: GrpcIcon,
  odoo: OdooIcon,
};

function normalizeTech(tech: string) {
  return tech.toLowerCase().trim();
}

function TechIcon({ tech }: { tech: string }) {
  const key = normalizeTech(tech);
  const Icon = TECH_ICON_MAP[key];

  if (Icon) {
    return (
      <TooltipWrapper content={tech}>
        <Icon size={40} />
      </TooltipWrapper>
    );
  }

  return (
    <Badge variant="secondary" className="transition-transform hover:scale-125">
      {tech}
    </Badge>
  );
}

export function TechStackIcons({ stack, className }: TechStackIconsProps) {
  if (!stack?.length) return null;

  return (
    <TooltipProvider delayDuration={100}>
      <div
        data-tech-stack
        className={cn(
          "flex flex-wrap items-center gap-2 justify-center",
          className,
        )}
      >
        {stack.map((tech) => (
          <TechIcon key={tech} tech={tech} />
        ))}
      </div>
    </TooltipProvider>
  );
}
