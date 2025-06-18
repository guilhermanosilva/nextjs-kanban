import { useState, useRef, useMemo, useEffect } from "react";
import { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Card, Stage } from "@prisma/client";
import { toast } from "sonner";

import { updateCardsOrderAction } from "@/features/kanban/actions/cards";
import { updateStagesOrderAction } from "@/features/kanban/actions/stages";

export function useKanbanBoard(stages: Stage[], cards: Card[]) {
  const [currentCard, setCurrentCard] = useState<Partial<Card> | null>(null);
  const [openCardDialog, setOpenCardDialog] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeStage, setActiveStage] = useState<Stage | null>(null);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [orderedStages, setOrderedStages] = useState<Stage[]>(stages ?? []);
  const [orderedCards, setOrderedCards] = useState<Card[]>(cards ?? []);

  const originalCardsRef = useRef<Card[]>(cards ?? []);

  const stagesIds = useMemo(() => orderedStages.map((stage) => stage.id), [orderedStages]);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleCloseCardDialog() {
    setOpenCardDialog(false);
    setCurrentCard(null);
  }

  function handleOpenCardDialog(card: Partial<Card>) {
    setOpenCardDialog(true);
    setCurrentCard(card);
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "column") {
      setActiveStage(event.active.data.current?.stage);
    }

    if (event.active.data.current?.type === "card") {
      setActiveCard(event.active.data.current?.card);
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeCard = active.data.current?.card;
    const activeType = active.data.current?.type;
    if (!activeCard || activeType === "column") return;

    const overCard = over.data.current?.card;
    const sourceStageId = activeCard.stageId;
    const destinationStageId = overCard?.stageId || over.id;

    const sourceIndex = active.data.current?.sortable.index;
    const destinationIndex = over.data.current?.sortable.index;

    const orderedCardList = [...orderedCards];
    const sourceCards = orderedCardList.filter((c) => c.stageId === sourceStageId);

    const isOverSameColumn = sourceStageId === destinationStageId;
    if (isOverSameColumn) {
      const movedCards = arrayMove(sourceCards, sourceIndex, destinationIndex);
      const updatedCardsOrder = movedCards.map((card, index) => ({ ...card, order: index }));
      const otherCards = orderedCardList.filter((c) => c.stageId !== sourceStageId);
      const newCardsList = [...otherCards, ...updatedCardsOrder];
      setOrderedCards(newCardsList);
    }

    if (!isOverSameColumn) {
      const destinationCards = orderedCardList.filter((c) => c.stageId === destinationStageId);
      if (!destinationCards) return;

      const [movedCard] = sourceCards.splice(sourceIndex, 1);
      const newCard = { ...movedCard, stageId: destinationStageId };
      destinationCards.splice(destinationIndex, 0, newCard);

      const updatedSourceCards = sourceCards.map((card, index) => ({ ...card, order: index }));
      const updatedDestinationCards = destinationCards.map((card, index) => ({ ...card, order: index }));

      const otherCards = orderedCardList.filter((c) => c.stageId !== sourceStageId && c.stageId !== destinationStageId);
      const newCardsList = [...otherCards, ...updatedSourceCards, ...updatedDestinationCards];
      setOrderedCards(newCardsList);
    }
  }

  async function onDragEnd(event: DragEndEvent) {
    setActiveStage(null);
    setActiveCard(null);

    const { active, over } = event;

    const type = active.data.current?.type;

    if (type === "column") {
      if (!over || active.id === over.id) return;

      const sourceIndex = orderedStages.findIndex((s) => s.id === active.id);
      const destinationIndex = orderedStages.findIndex((s) => s.id === over.id);
      if (sourceIndex === -1 || destinationIndex === -1) return;

      const movedItems = arrayMove(orderedStages, sourceIndex, destinationIndex);
      const updatedItems = movedItems.map((item, index) => ({ ...item, order: index }));

      setOrderedStages(updatedItems);

      const { data, error } = await updateStagesOrderAction(updatedItems);
      if (error) toast.error(error);
      if (data) toast.success("Colunas atualizadas com sucesso");

      return;
    }

    if (type === "card") {
      const originalCards = originalCardsRef.current;

      const changedCards = orderedCards.filter((card) => {
        const original = originalCards.find((c) => c.id === card.id);
        return original && (original.order !== card.order || original.stageId !== card.stageId);
      });

      if (changedCards.length === 0) return;

      const { data, error } = await updateCardsOrderAction(changedCards);
      if (error) toast.error(error);
      if (data) toast.success("Cards atualizados com sucesso");
    }
  }

  return {
    currentCard,
    openCardDialog,
    handleCloseCardDialog,
    handleOpenCardDialog,
    orderedStages,
    orderedCards,
    stagesIds,
    onDragStart,
    onDragOver,
    onDragEnd,
    mounted,
    activeStage,
    activeCard,
  };
}
