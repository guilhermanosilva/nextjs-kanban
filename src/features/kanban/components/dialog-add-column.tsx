'use client'

import { useState } from 'react'

import { DialogWrapper } from '@/components/dialog-wrapper'
import { FormAddColumn } from '@/features/kanban/components/form-add-column'

export function DialogAddColumn({ trigger }: { trigger?: React.ReactNode }) {
  const [openColumnDialog, setOpenColumnDialog] = useState(false)

  return (
    <DialogWrapper
      title="Adicionar coluna"
      description="Insira os dados da coluna"
      open={openColumnDialog}
      onOpenChange={setOpenColumnDialog}
      trigger={trigger}
    >
      <FormAddColumn />
    </DialogWrapper>
  )
}
