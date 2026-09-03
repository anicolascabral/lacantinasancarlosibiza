"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      className={cn(
        "block text-[0.62rem] font-bold uppercase tracking-widest text-muted-foreground font-body mb-1.5",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
