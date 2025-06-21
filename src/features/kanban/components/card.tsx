'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card as PrismaCard } from '@prisma/client'
import { PencilIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'


export function Card({ card, onEdit }: { card: PrismaCard; onEdit: (card: PrismaCard) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
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
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={cn(
        'bg-background flex flex-col gap-3 rounded-md border p-3 pb-4',
        isDragging && 'pointer-events-none opacity-50 ring-1 bg-accent animate-pulse',
      )}
    >
      <header className="flex items-center justify-between">
        <span className="text-sm">{card.title}</span>
        <Button variant="link" className="size-5 hover:opacity-70" onClick={() => onEdit(card)}>
          <PencilIcon />
        </Button>
      </header>

      <div className="mb-1 flex flex-wrap items-center gap-1">
        <Badge variant="secondary" size="xxs">
          Badge List
        </Badge>
      </div>

      <div>
        <span className="text-xs opacity-70">{card.description}</span>
      </div>
    </div>
  )
}

export function OverlayCard({ card }: { card: PrismaCard }) {
  const { isDragging } = useSortable({
    id: card.id,
    data: {
      type: 'card',
      card,
    },
  })

  return (
    <div
      className={cn(
        'bg-background flex flex-col gap-3 rounded-md border p-3 pb-4',
        isDragging && 'pointer-events-none opacity-50 ring ring-rose-400',
      )}
    >
      <header className="flex items-center justify-between">
        <span className="text-sm">{card.title}</span>
      </header>

      <div className="mb-1 flex flex-wrap items-center gap-1">
        <Badge variant="secondary" size="xxs">
          Badge List
        </Badge>
      </div>

      <div>
        <span className="text-xs opacity-70">{card.description}</span>
      </div>
    </div>
  )
}
