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

  snapPoints?: (string | number)[];
  snapPoint?: string | number | null;
  onSnapPointChange?: (snapPoint: string | number | null) => void;
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
  snapPoints,
  snapPoint,
  onSnapPointChange,
}: ResponsiveDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange : setInternalOpen;

  // رندر دسکتاپ: با محدودیت حداکثر ارتفاع و اسکرول داخلی برای محتوای بلند
  if (isDesktop) {
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

          {/* محتوا اسکرول می‌خورد بدون اینکه هدر جابه‌جا شود */}
          <div className={cn("overflow-y-auto px-6 pb-6", hideHeader && "pt-6", contentClassName)}>
            {children}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // رندر موبایل: هماهنگ با ارتفاع خودکار یا SnapPoints
  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      showSwipeHandle
      snapPoints={snapPoints}
      snapPoint={snapPoint}
      onSnapPointChange={onSnapPointChange}
    >
      {trigger && <DrawerTrigger render={trigger} />}
      <DrawerContent
        className={cn(
          "mx-0 mb-0 rounded-b-none flex flex-col",
          // اگر snapPoints باشد، دراور تمام قد می‌ایستد تا اسنپ‌ها کار کنند؛ در غیر این صورت به اندازه محتوا باز می‌شود
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
