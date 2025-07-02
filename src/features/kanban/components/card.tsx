'use client'

import React from 'react'
import { Card as PrismaCard } from '@prisma/client'
import { EllipsisIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { Button } from '@/components/ui/button'
import { CardAction, Card as CardContainer, CardHeader, CardTitle } from '@/components/ui/card'

export function Card({ card, onEdit }: { card: PrismaCard; onEdit: (card: PrismaCard) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging, } = useSortable({
    id: card.id,
    data: {
      type: 'card',
      card,
    },
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  return (
    <CardContainer
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={cn(
        'bg-accent shadow-none border-0 p-2.5 rounded-lg gap-1 min-h-10 max-h-fit hover:ring-1 hover:ring-foreground/50',
        isDragging && 'pointer-events-none'
      )}>
      <CardHeader className="p-0 gap-0">
        <CardTitle className="self-center leading-0 text-sm font-normal text-foreground/70 mr-3 select-none">
          {card.title}
        </CardTitle>

        <CardAction className="flex self-center">
          <Button
            variant="link"
            size="icon"
            className="size-3 text-foreground/40 hover:text-foreground/70 transition-colors"
            onClick={() => onEdit(card)}>
            <EllipsisIcon className="!size-4 stroke-1" />
          </Button>
        </CardAction>
      </CardHeader>
    </CardContainer>
  )
}

export function OverlayCard({ card }: { card: PrismaCard }) {
  return (
    <CardContainer className="bg-accent shadow-none border-0 p-2.5 rounded-lg gap-1 opacity-70 rotate-6">
      <CardHeader className="p-0">
        <CardTitle className="text-sm font-normal text-foreground/60">{card.title}</CardTitle>
      </CardHeader>
    </CardContainer>
  )
}
