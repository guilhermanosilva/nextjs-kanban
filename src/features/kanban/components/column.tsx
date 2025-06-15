"use client";

import { PropsWithChildren } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PlusIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Stage } from "@prisma/client";
import { Button } from "@/components/ui/button";

export function Column({ stage, className, children }: { stage: Stage; className?: string } & PropsWithChildren) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: stage.id,
    data: {
      type: "column",
      stage,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={cn("bg-accent max-w-3xs min-w-3xs flex-1 rounded border", className, {
        "animate-pulse opacity-70": isDragging,
      })}
    >
      <header className="p-3">
        <span>{stage.name}</span>
      </header>

      <div className="p-2 flex flex-col gap-2">
        {children}

        <Button variant="link" className="text-xsm self-center text-zinc-400 hover:no-underline hover:opacity-70 gap-1">
          <PlusIcon /> Adicionar tarefa
        </Button>
      </div>
    </div>
  );
}

export function OverlayColumn({ stage, children }: { stage: Stage | null } & PropsWithChildren) {
  return (
    <div className="bg-accent min-h-11/12 max-w-3xs flex-1 rounded ring">
      <header className="border-b p-2 text-sm">
        <span>{stage?.name || "Coluna"}</span>
      </header>
      <div className="p-2">{children}</div>
    </div>
  );
}
