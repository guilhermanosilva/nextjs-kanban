'use client'

import { useState, useEffect } from 'react'
import { PlusIcon } from 'lucide-react'

import { Label } from '@prisma/client'
import { useFetchAction } from '@/hooks/useFetchAction'

import { DialogWrapper } from '@/components/dialog-wrapper'
import { Button } from '@/components/ui/button'

import { ListLabelsSkeleton } from '@/features/configuration/components/labels/list-labels'
import { FormAddLabel } from '@/features/configuration/components/labels/form-add-label'
import { ListLabels } from '@/features/configuration/components/labels/list-labels'
import { getLabelsAction } from '@/features/kanban/actions/labels'

type LabelsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LabelsDialog({ open, onOpenChange }: LabelsDialogProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [labels, setLabels] = useState<Label[]>([])
  const { data: labelsData, isLoading, isError } = useFetchAction(getLabelsAction)

  function handleSaveLabel(label: Label) {
    setLabels((prev) => [...prev, label])
  }

  function handleDeleteLabel(id: string) {
    setLabels((prev) => prev.filter((label) => label.id !== id))
  }

  useEffect(() => {
    if (labelsData) {
      setLabels(labelsData)
    }
  }, [labelsData])

  return (
    <DialogWrapper
      title="Gerenciamento de labels"
      description="Acicione ou edite as labels que serão usadas para categorizar as tarefas."
      open={open}
      onOpenChange={onOpenChange}
    >
      <Button
        variant="outline"
        size="sm"
        type="button"
        className="mr-auto gap-1 items-center"
        disabled={isAdding}
        onClick={() => setIsAdding(true)}
      >
        <PlusIcon /> <span className="text-xs">NOVA LABEL</span>
      </Button>

      {isAdding && <FormAddLabel onSave={handleSaveLabel} onClose={() => setIsAdding(false)} />}

      {isLoading && <ListLabelsSkeleton />}
      {isError && <p>Erro ao buscar labels</p>}
      {!isLoading && !isError && <ListLabels data={labels} onDelete={handleDeleteLabel} />}
    </DialogWrapper>
  )
}
