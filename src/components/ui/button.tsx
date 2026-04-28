import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center transition-[transform,box-shadow,border-color,color,background-color] duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 outline-none motion-reduce:transition-none motion-reduce:transform-none",
  {
    variants: {
      variant: {
        pill: "gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-sm text-foreground/80 hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-sm active:translate-y-0 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2",
      },
    },
    defaultVariants: {
      variant: "pill",
    },
  },
);

function Button({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      data-variant={variant ?? "pill"}
      className={cn(buttonVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
