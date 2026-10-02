"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";

export interface ResponsiveDialogProps {
  children: React.ReactNode;
  trigger?: React.ReactElement;
  title: React.ReactNode;
  description?: React.ReactNode;
  hideHeader?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  contentClassName?: string;
  type?: "dialog" | "drawer" | "auto";
  desktopBreakpoint?: string;
  snapPoints?: (string | number)[];
  snapPoint?: string | number | null;
  onSnapPointChange?: (snapPoint: string | number | null) => void;
  showSwipeHandle?: boolean;
}

export function ResponsiveDialog({
  children,
  trigger,
  title,
  description,
  hideHeader = false,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  className,
  contentClassName,
  type = "auto",
  desktopBreakpoint = "(min-width: 640px)",
  snapPoints,
  snapPoint,
  onSnapPointChange,
  showSwipeHandle = true,
}: ResponsiveDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isDesktop = useMediaQuery(desktopBreakpoint);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange : setInternalOpen;

  const renderAsDialog = type === "dialog" || (type === "auto" && isDesktop);

  if (renderAsDialog) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        {trigger && <DialogTrigger render={trigger} />}
        <DialogContent
          className={cn(
            "sm:max-w-[480px] max-h-[85vh] flex flex-col gap-0 p-0 overflow-hidden",
            className,
          )}
        >
          {hideHeader ? (
            <div className="sr-only">
              <DialogTitle>{title}</DialogTitle>
              {description && <DialogDescription>{description}</DialogDescription>}
            </div>
          ) : (
            <DialogHeader className="p-6 pb-4">
              <DialogTitle>{title}</DialogTitle>
              {description && <DialogDescription>{description}</DialogDescription>}
            </DialogHeader>
          )}

          <div className={cn("overflow-y-auto px-6 pb-6", hideHeader && "pt-6", contentClassName)}>
            {children}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      showSwipeHandle={showSwipeHandle}
      snapPoints={snapPoints}
      snapPoint={snapPoint}
      onSnapPointChange={onSnapPointChange}
    >
      {trigger && <DrawerTrigger render={trigger} />}
      <DrawerContent
        className={cn(
          "mx-0 mb-0 rounded-b-none flex flex-col",
          snapPoints ? "h-full max-h-[92vh]" : "max-h-[85vh]",
          className,
        )}
      >
        {hideHeader ? (
          <div className="sr-only">
            <DrawerTitle>{title}</DrawerTitle>
            {description && <DrawerDescription>{description}</DrawerDescription>}
          </div>
        ) : (
          <DrawerHeader className="text-left px-4 pt-4 pb-2">
            <DrawerTitle>{title}</DrawerTitle>
            {description && <DrawerDescription>{description}</DrawerDescription>}
          </DrawerHeader>
        )}

        <div className={cn("overflow-y-auto px-4 pb-6 flex-1", contentClassName)}>{children}</div>
      </DrawerContent>
    </Drawer>
  );
}
