"use client";

import type { ComponentType, SVGProps } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

export interface PillLink {
  label: string;
  href: string;
  text: string;
  Icon: IconType;
}

export function ContactPill({ link }: { link: PillLink }) {
  const external = link.href.startsWith("http");
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button asChild variant="pill">
          <a
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            href={link.href}
            aria-label={link.label}
          >
            <link.Icon className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{link.text}</span>
          </a>
        </Button>
      </TooltipTrigger>
      <TooltipContent>{link.label}</TooltipContent>
    </Tooltip>
  );
}
