'use client'

import { PropsWithChildren } from 'react'
import { Stage } from '@prisma/client'
import { cn } from '@/lib/utils'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type ColumnProps = {
  stage: Stage;
  className?: string;
  disabled?: boolean;
} & PropsWithChildren;

export function Column({ stage, className, children, disabled }: ColumnProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: stage.id,
    data: {
      type: 'column',
      stage,
    },
    disabled,
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  return (
    <li
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={cn('bg-background max-w-3xs min-w-3xs rounded-lg border flex flex-col h-fit', {
        'animate-pulse opacity-70 ring-1': isDragging,
        className
      })}
    >
      <header className="px-4 pt-3 pb-0 text-sm text-foreground/80 font-semibold">
        <span>{stage.name}</span>
      </header>

      <div className="flex flex-col gap-2.5 p-2.5">{children}</div>
    </li>
  )
}

export function ColumnOverlay({ stage, children }: { stage: Stage | null } & PropsWithChildren) {
  return (
    <li className="bg-accent max-w-3xs flex-1 rounded border flex flex-col ring-1 min-h-11/12">
      <header className="border-b p-2 text-sm">
        <span>{stage?.name || 'Coluna'}</span>
      </header>

      <div className="flex flex-1 flex-col gap-2 p-2">{children}</div>
    </li>
  )
}
