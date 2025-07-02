'use client'

import { useState, useTransition, useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { PencilIcon, SaveIcon, Trash2Icon, XIcon } from 'lucide-react'

import { Label } from '@prisma/client'
import { cn } from '@/lib/utils'

import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/spinner'
import { Tag } from '@/components/ui/tag'

import { updateLabelSchema, UpdateLabelType } from '@/features/configuration/schemas/update-label'
import { PickColorButtons } from '@/features/configuration/components/labels/pick-color-buttons'
import { PickColorField } from '@/features/configuration/components/labels/pick-color-field'
import { deleteLabelAction, updateLabelAction } from '@/features/kanban/actions/labels'

type LabelListItemProps = {
  label: Label
  onDelete: (id: string) => void
}

export function FormUpdateLabel({ label, onDelete }: LabelListItemProps) {
  const [state, setState] = useState<'view' | 'edit'>('view')
  const [isDeleting, startDeleting] = useTransition()
  const [isSaving, startSaving] = useTransition()
  const tagRef = useRef<HTMLInputElement>(null)

  const form = useForm<UpdateLabelType>({
    resolver: zodResolver(updateLabelSchema),
    defaultValues: {
      id: label.id,
      name: label.name,
      color: label.color,
    }
  })

  const color = form.watch('color')

  function handleEdit() {
    setState('edit')
    tagRef.current?.focus()
  }

  function handleCloseEdit() {
    setState('view')
    form.reset()
  }

  function handleDelete(id: string) {
    startDeleting(async () => {
      const { error } = await deleteLabelAction(id)

      if (error) {
        toast.error(error || 'Erro ao excluir label')
        return
      }

      handleCloseEdit()
      onDelete(id)
    })
  }

  function handleSubmit(data: UpdateLabelType) {
    startSaving(async () => {
      const { error } = await updateLabelAction(data)

      if (error) {
        toast.error(error || 'Erro ao atualizar label')
        form.reset()
        return
      }

      setState('view')
    })
  }

  return (
    <FormProvider {...form}>
      <form
        className="flex items-center gap-2 border rounded-sm p-1.5 transition-colors durantion-1000"
        style={{ borderColor: state === 'edit' ? color : undefined }}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2" >
              <FormControl>
                <Tag
                  ref={tagRef}
                  readOnly={state === 'view' || isDeleting || isSaving}
                  color={color}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  className={cn(
                    isDeleting || isSaving && 'opacity-70',
                    state === 'view' && 'cursor-default'
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className={cn(
          'flex items-center gap-2 opacity-50 max-w-0 h-7 overflow-hidden transition-all duration-300',
          state === 'edit' && 'opacity-100 max-w-96'
        )}>
          {state === 'edit' && (
            <>
              <PickColorField control={form.control} name="color" />
              <PickColorButtons control={form.control} name="color" />
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          {state === 'view' && (
            <>
              <Button
                variant="outline"
                size="icon"
                type="button"
                className="ml-auto self-end size-7 opacity-50 hover:opacity-100 hover:text-destructive transition-[opacity,color]"
                onClick={() => handleDelete(label.id)}
                disabled={isDeleting}
              >
                {isDeleting ? <Spinner /> : <Trash2Icon />}
              </Button>

              <Button
                variant="outline"
                size="icon"
                type="button"
                className="ml-auto self-end size-7 opacity-50 hover:opacity-100 transition-opacity"
                onClick={handleEdit}
                disabled={isDeleting}
              >
                <PencilIcon />
              </Button>
            </>
          )}

          {state === 'edit' && (
            <>
              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant="outline"
                  size="icon"
                  type="submit"
                  className="size-7 opacity-70 hover:opacity-100"
                  disabled={isSaving}
                >
                  {isSaving ? <Spinner /> : <SaveIcon />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="size-7 opacity-70 hover:opacity-100"
                  onClick={handleCloseEdit}
                  disabled={isSaving}
                >
                  <XIcon />
                </Button>
              </div>
            </>
          )}
        </div>
      </form>
    </FormProvider>
  )
}
