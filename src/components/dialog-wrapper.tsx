import { PropsWithChildren, ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type DialogWrapperProps = PropsWithChildren<{
  title: string;
  description?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: ReactNode;
}>;

export function DialogWrapper({ children, title, description, open, onOpenChange, trigger }: DialogWrapperProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
}
