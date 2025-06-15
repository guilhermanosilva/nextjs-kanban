"use client";

import { createPortal } from "react-dom";
import { SortableContext } from "@dnd-kit/sortable";
import { DndContext, DragOverlay } from "@dnd-kit/core";

import { Stage } from "@prisma/client";
import { cn } from "@/lib/utils";

import { Column, OverlayColumn } from "@/features/kanban/components/column";
import { Task } from "@/features/kanban/components/task";
import { useColumns } from "@/features/kanban/hooks/use-columns";

export function Columns({ stages }: { stages: Stage[] }) {
  const { onDragStart, onDragEnd, orderedStages, stagesIds, isPending, mounted, activeStage } = useColumns(stages);

  return (
    <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <section className="flex flex-1 gap-4 overflow-x-auto rounded border p-2.5">
        <SortableContext items={stagesIds}>
          {orderedStages.map((stage) => (
            <Column key={stage.id} stage={stage} className={cn({ "animate-pulse opacity-70": isPending })}>
              <Task />
            </Column>
          ))}
        </SortableContext>
      </section>

      {mounted &&
        createPortal(
          <DragOverlay>
            <OverlayColumn stage={activeStage} />
          </DragOverlay>,
          document.body,
        )}
    </DndContext>
  );
}
