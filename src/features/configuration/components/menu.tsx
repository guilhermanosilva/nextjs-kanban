'use client'

import { useState } from 'react'
import { SettingsIcon, TagsIcon } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

import { LabelsDialog } from '@/features/configuration/components/labels/dialog'

type DialogTypes = 'labels'

export function ConfigurationMenu() {
  const [dialogType, setDialogType] = useState<DialogTypes | null>(null)

  function handleSelectMenu(type?: DialogTypes | null, e?: Event) {
    e?.preventDefault()
    setDialogType(type || null)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="link" className="text-xsm gap-1 text-foreground/80 font-normal hover:no-underline hover:opacity-70 h-6 w-fit !px-1">
          <SettingsIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="left" align="start">
        <DropdownMenuLabel>Configurações</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={(e) => handleSelectMenu('labels', e)}>
          <TagsIcon /> Labels
        </DropdownMenuItem>
      </DropdownMenuContent>

      {
        dialogType === 'labels' &&
        <LabelsDialog open={true} onOpenChange={() => handleSelectMenu(null)} />
      }
    </DropdownMenu>
  )
}
