import Go from "react-devicons/go/original";
import Kubernetes from "react-devicons/kubernetes/plain";
import Amazonwebservice from "react-devicons/amazonwebservices/original-wordmark";
import Typescript from "react-devicons/typescript/original";
import Postgresql from "react-devicons/postgresql/original-wordmark";
import ReactIcon from "react-devicons/react/original-wordmark";
import Vuejs from "react-devicons/vuejs/original-wordmark";
import Dotnet from "react-devicons/dotnetcore/original";
import Mysql from "react-devicons/mysql/original-wordmark";
import Docker from "react-devicons/docker/original-wordmark";
import Graphql from "react-devicons/graphql/plain-wordmark";
import Mongodb from "react-devicons/mongodb/original-wordmark";
import Redis from "react-devicons/redis/original-wordmark";
import Tailwindcss from "react-devicons/tailwindcss/original";
import Terraform from "react-devicons/terraform/original-wordmark";
import Github from "react-devicons/github/original-wordmark";
import Azure from "react-devicons/azure/original";
import Facebook from "react-devicons/facebook/original";
import Neo4j from "react-devicons/neo4j/original-wordmark";
import Grafana from "react-devicons/grafana/original-wordmark";
import Microsoftsqlserver from "react-devicons/microsoftsqlserver/plain-wordmark";

interface TechStackIconsProps {
  stack?: string[];
}

type IconComponent = React.FunctionComponent<
  React.SVGProps<SVGElement> & { size?: number | string }
>;

const TECH_ICON_MAP: Record<string, IconComponent> = {
  go: Go,
  dotnet: Dotnet,
  kubernetes: Kubernetes,
  terraform: Terraform,
  docker: Docker,
  grafana: Grafana,
  github: Github,
  aws: Amazonwebservice,
  azure: Azure,
  typescript: Typescript,
  graphql: Graphql,
  postgresql: Postgresql,
  mongodb: Mongodb,
  neo4j: Neo4j,
  redis: Redis,
  mysql: Mysql,
  mssql: Microsoftsqlserver,
  react: ({ size }) => <ReactIcon size={size} color="#0C9FC9" />,
  vue: Vuejs,
  tailwindcss: Tailwindcss,
  facebook: Facebook,
};

function normalizeTech(tech: string) {
  return tech.toLowerCase().trim();
}

function TechIcon({ tech }: { tech: string }) {
  const key = normalizeTech(tech);
  const Icon = TECH_ICON_MAP[key];

  if (Icon) {
    return <Icon size={40} />;
  }

  return (
    <span className="bg-zinc-100 text-zinc-600 rounded-full px-2 py-0.5 text-xs">
      {tech}
    </span>
  );
}

export function TechStackIcons({ stack }: TechStackIconsProps) {
  if (!stack?.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {stack.map((tech) => (
        <TechIcon key={tech} tech={tech} />
      ))}
    </div>
  );
}
