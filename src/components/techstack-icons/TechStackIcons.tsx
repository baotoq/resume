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
import { AzureIcon } from "./AzureIcon";
import { DapperIcon } from "./DapperIcon";
import { DaprIcon } from "./DaprIcon";
import { EFCoreIcon } from "./EFCoreIcon";
import { ELKIcon } from "./ELKIcon";
import { FluxCDIcon } from "./FluxCDIcon";
import { GrpcIcon } from "./GrpcIcon";
import { OdooIcon } from "./OdooIcon";

interface TechStackIconsProps {
  stack?: string[];
}

type IconComponent = React.FunctionComponent<
  React.SVGProps<SVGElement> & { size?: number | string }
>;

const TECH_ICON_MAP: Record<string, IconComponent> = {
  go: Go,
  ".net": Dotnet,
  kubernetes: Kubernetes,
  terraform: Terraform,
  docker: Docker,
  grafana: Grafana,
  github: Github,
  aws: Amazonwebservice,
  azure: ({ size }) => <AzureIcon size={size} />,
  typescript: Typescript,
  graphql: Graphql,
  postgresql: Postgresql,
  mongodb: Mongodb,
  neo4j: Neo4j,
  redis: Redis,
  mysql: Mysql,
  mssql: Microsoftsqlserver,
  react: ({ size }) => <ReactIcon size={size} color="#0380A2" />,
  vue: () => <Vuejs size={38} />,
  tailwindcss: Tailwindcss,
  facebook: Facebook,
  dapr: ({ size }) => <DaprIcon size={size} />,
  dapper: ({ size }) => <DapperIcon size={size} />,
  "ef core": ({ size }) => <EFCoreIcon size={size} />,
  "elk stack": ({ size }) => <ELKIcon size={size} />,
  fluxcd: ({ size }) => <FluxCDIcon size={size} />,
  grpc: ({ size }) => <GrpcIcon size={size} />,
  odoo: ({ size }) => <OdooIcon size={size} />,
};

function normalizeTech(tech: string) {
  return tech.toLowerCase().trim();
}

function TechIcon({ tech }: { tech: string }) {
  const key = normalizeTech(tech);
  const Icon = TECH_ICON_MAP[key];

  if (Icon) {
    return (
      <div className="relative group">
        <Icon size={40} />
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap pointer-events-none z-10">
          {tech}
        </span>
      </div>
    );
  }

  return <Badge variant="secondary">{tech}</Badge>;
}

export function TechStackIcons({ stack }: TechStackIconsProps) {
  if (!stack?.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 justify-center">
      {stack.map((tech) => (
        <TechIcon key={tech} tech={tech} />
      ))}
    </div>
  );
}
