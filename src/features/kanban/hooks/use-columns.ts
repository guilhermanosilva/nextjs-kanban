import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { Stage } from "@prisma/client";
import { toast } from "sonner";
import { arrayMove } from "@dnd-kit/sortable";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";

import { getChangedStages } from "@/lib/utils";
import { updateStagesOrderAction } from "@/features/kanban/actions/stages";

export function useColumns(stages: Stage[]) {
  const [mounted, setMounted] = useState(false);
  const [orderedStages, setOrderedStages] = useState<Stage[]>([]);
  const [activeStage, setActiveStage] = useState<Stage | null>(null);

  const stagesIds = useMemo(() => orderedStages.map((stage) => stage.id), [orderedStages]);

  const [isPending, startTransition] = useTransition();

  function handleUpdateStagesOrder(stages: Stage[]) {
    startTransition(async () => {
      const { data, error } = await updateStagesOrderAction(stages);

      if (!data || error) {
        toast.error(error || "Erro ao atualizar a ordem das colunas");
      }
    });
  }

  const onDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const stage = stages.find((s) => s.id === active.id);
      if (stage) setActiveStage(stage);
    },
    [stages],
  );

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = orderedStages.findIndex((s) => s.id === active.id);
      const newIndex = orderedStages.findIndex((s) => s.id === over.id);
      const newOrder = arrayMove(orderedStages, oldIndex, newIndex).map((stage, index) => ({ ...stage, order: index }));

      const changedItems = getChangedStages(orderedStages, newOrder);
      if (changedItems.length > 0) handleUpdateStagesOrder(changedItems);
      setOrderedStages(newOrder);
      setActiveStage(null);
    },
    [orderedStages],
  );

  useEffect(() => {
    setOrderedStages(stages);
  }, [stages]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return { orderedStages, stagesIds, onDragStart, onDragEnd, isPending, mounted, activeStage };
}
