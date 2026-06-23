"use client";

import * as React from "react";
import { useIsMobile } from "@/hooks/useMediaQuery";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type ResponsiveDialogProps = React.ComponentProps<typeof Dialog>;

export function ResponsiveDialog({ children, ...props }: ResponsiveDialogProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <Sheet {...props}>{children}</Sheet>;
  }

  return <Dialog {...props}>{children}</Dialog>;
}

export function ResponsiveDialogTrigger({ children, ...props }: React.ComponentProps<typeof DialogTrigger>) {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return <SheetTrigger {...props}>{children}</SheetTrigger>;
  }

  return <DialogTrigger {...props}>{children}</DialogTrigger>;
}

export function ResponsiveDialogClose({ children, ...props }: React.ComponentProps<typeof DialogClose>) {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return <SheetClose {...props}>{children}</SheetClose>;
  }

  return <DialogClose {...props}>{children}</DialogClose>;
}

export function ResponsiveDialogContent({ children, className, ...props }: React.ComponentProps<typeof DialogContent>) {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return (
      <SheetContent side="bottom" className={className} {...props}>
        {children}
      </SheetContent>
    );
  }

  return (
    <DialogContent className={className} {...props}>
      {children}
    </DialogContent>
  );
}

export function ResponsiveDialogHeader({ children, className, ...props }: React.ComponentProps<typeof DialogHeader>) {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return (
      <SheetHeader className={className} {...props}>
        {children}
      </SheetHeader>
    );
  }

  return (
    <DialogHeader className={className} {...props}>
      {children}
    </DialogHeader>
  );
}

export function ResponsiveDialogTitle({ children, className, ...props }: React.ComponentProps<typeof DialogTitle>) {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return (
      <SheetTitle className={className} {...props}>
        {children}
      </SheetTitle>
    );
  }

  return (
    <DialogTitle className={className} {...props}>
      {children}
    </DialogTitle>
  );
}

export function ResponsiveDialogDescription({ children, className, ...props }: React.ComponentProps<typeof DialogDescription>) {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return (
      <SheetDescription className={className} {...props}>
        {children}
      </SheetDescription>
    );
  }

  return (
    <DialogDescription className={className} {...props}>
      {children}
    </DialogDescription>
  );
}

export function ResponsiveDialogFooter({ children, className, ...props }: React.ComponentProps<typeof DialogFooter>) {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return (
      <SheetFooter className={className} {...props}>
        {children}
      </SheetFooter>
    );
  }

  return (
    <DialogFooter className={className} {...props}>
      {children}
    </DialogFooter>
  );
}
