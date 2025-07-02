'use client'

import { createPortal } from 'react-dom'
import { SortableContext } from '@dnd-kit/sortable'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { PlusIcon } from 'lucide-react'
import { Card as PrismaCard, Stage } from '@prisma/client'

import { Button } from '@/components/ui/button'
import { DialogAddColumn } from '@/features/kanban/components/dialog-add-column'
import { DialogAddCard } from '@/features/kanban/components/dialog-add-card'
import { Column, ColumnOverlay } from '@/features/kanban/components/column'
import { Card, OverlayCard } from '@/features/kanban/components/card'
import { useKanbanBoard } from '@/features/kanban/hooks/use-kanban-board'

type KanbanBoardProps = {
  stages: Stage[];
  cards: PrismaCard[];
};

export function KanbanBoard({ stages, cards }: KanbanBoardProps) {
  const {
    mounted,
    orderedStages,
    orderedCards,
    activeStage,
    activeCard,
    stagesIds,
    currentCard,
    openCardDialog,
    onDragStart,
    onDragEnd,
    onDragOver,
    handleOpenCardDialog,
    handleCloseCardDialog,
  } = useKanbanBoard(stages, cards)

  const sensor = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 10 } }))

  if (!mounted) return null

  if (stages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-6">
        <span className="">Para começar, adicione uma coluna.</span>
        <DialogAddColumn trigger={<Button variant="outline">Adicionar coluna</Button>} />
      </div>
    )
  }

  return (
    <>
      <div className="flex-1 flex flex-col p-3 overflow-x-auto">
        <DndContext
          sensors={sensor}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
        >
          <ul className="flex gap-4">
            <SortableContext items={stagesIds}>
              {orderedStages.map((stage) => {
                const stageCards = orderedCards.filter((card) => card.stageId === stage.id)
                const stageCardIds = stageCards.map((card) => card.id)

                return (
                  <Column key={stage.id} stage={stage} disabled={!!activeCard}>
                    <SortableContext items={stageCardIds}>
                      {stageCards.map((card) => (
                        <Card key={card.id} card={card} onEdit={() => handleOpenCardDialog(card)} />
                      ))}
                    </SortableContext>

                    <Button
                      variant="link"
                      className="text-xsm gap-1 text-foreground/60 hover:no-underline hover:opacity-70 h-6 w-fit !px-0"
                      onClick={() => handleOpenCardDialog({ stageId: stage.id })}
                    >
                      <PlusIcon /> Adicionar tarefa
                    </Button>
                  </Column>
                )
              })}

              <DialogAddColumn trigger={<Button variant="outline">Adicionar coluna</Button>} />
            </SortableContext>
          </ul>

          {createPortal(
            <DragOverlay>
              {activeStage && (
                <ColumnOverlay stage={activeStage}>
                  {orderedCards
                    .filter((card) => card.stageId === activeStage?.id)
                    .map((card) => (
                      <OverlayCard key={card.id} card={card} />
                    ))}
                </ColumnOverlay>
              )}

              {activeCard && <OverlayCard card={activeCard} />}
            </DragOverlay>,
            document.body,
          )}
        </DndContext>

        {currentCard?.stageId && (
          <DialogAddCard
            initialData={currentCard}
            open={openCardDialog}
            onOpenChange={handleCloseCardDialog}
            onSuccess={handleCloseCardDialog}
          />
        )}
      </div>
    </>
  )
}
