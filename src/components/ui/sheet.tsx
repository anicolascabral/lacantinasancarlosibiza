"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;

function SheetOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn("fixed inset-0 z-50 bg-black/50", className)}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  // Forms with several inputs need the full screen: a bottom-anchored sheet
  // ends up behind the phone keyboard, which buries the fields you're typing
  // into and makes moving between them a fight.
  fullScreen = false,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & { fullScreen?: boolean }) {
  return (
    <DialogPrimitive.Portal>
      <SheetOverlay />
      <DialogPrimitive.Content
        className={cn(
          "fixed z-50 flex flex-col border-border bg-card p-5 overflow-y-auto",
          fullScreen
            ? "inset-0 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))]"
            : "inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl border-t pb-[max(1.25rem,env(safe-area-inset-bottom))]",
          className,
        )}
        {...props}
      >
        {!fullScreen && <div className="mx-auto mb-4 h-1 w-10 flex-shrink-0 rounded-full bg-muted" />}
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 text-muted-foreground">
          <X size={18} />
          <span className="sr-only">Cerrar</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mb-3 flex-shrink-0", className)} {...props} />;
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("font-body text-lg font-bold text-foreground", className)}
      {...props}
    />
  );
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetTitle };
