"use client";

import type { ComponentType, SVGProps } from "react";
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
        <a
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          href={link.href}
          aria-label={link.label}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-sm text-foreground/80 transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
        >
          <link.Icon className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{link.text}</span>
        </a>
      </TooltipTrigger>
      <TooltipContent>{link.label}</TooltipContent>
    </Tooltip>
  );
}
