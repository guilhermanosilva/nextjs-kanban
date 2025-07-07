'use client'

import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { useFetchAction } from '@/hooks/useFetchAction'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/spinner'
import { Skeleton } from '@/components/ui/skeleton'
import { Tag } from '@/components/ui/tag'

import { createCardFormSchema, CreateCardForm } from '@/features/kanban/schemas/create-card'
import { createCardAction, updateCardAction } from '@/features/kanban/actions/cards'
import { getLabelsAction } from '@/features/kanban/actions/labels'
import { CardWithLabels } from '@/features/kanban/schemas/get-card'

type FormCardProps = {
  onSuccess: VoidFunction;
  initialData: Partial<CardWithLabels> | null;
};

export function FormAddCard({ onSuccess, initialData }: FormCardProps) {
  const [isPending, setIsPending] = useState(false)

  const { data: labelsData, isLoading } = useFetchAction(getLabelsAction)

  const form = useForm<CreateCardForm>({
    resolver: zodResolver(createCardFormSchema),
    defaultValues: {
      title: '',
      description: '',
      cardLabel: [],
      ...initialData
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'cardLabel'
  })

  function getLabelIndex(labelId: string) {
    return fields.findIndex((field) => field.labelId === labelId)
  }

  function toggleAddLabel(labelId: string) {
    const labelIndex = getLabelIndex(labelId)
    if (labelIndex > -1) {
      remove(labelIndex)
    } else {
      append({ labelId })
    }
  }

  async function handleSubmit(formData: CreateCardForm) {
    try {
      setIsPending(true)
      const { data, error } = initialData?.id
        ? await updateCardAction(initialData, formData)
        : await createCardAction(formData)

      if (!data || error) {
        toast.error(error || 'Ocorreu um erro ao salvar os dados')
        return
      }

      toast.success(`Tarefa "${data.title}" salva com sucesso.`)
      onSuccess()
      form.reset()
      setIsPending(false)
    } catch {
      toast.error('Erro inesperado ao salvar os dados. Tente novamente.')
      setIsPending(false)
    }
  }

  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col gap-4 space-y-4', isPending && 'animate-pulse')}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título da tarefa</FormLabel>
              <FormControl>
                <Input placeholder="Título da tarefa" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="Descrição" {...field} value={field.value || ''} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cardLabel"
          render={() => {
            return (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <div>
                    {isLoading && (
                      <div className="flex gap-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <Skeleton key={i} className="h-7 w-32" />
                        ))}
                      </div>
                    )}

                    {(!isLoading && labelsData && labelsData.length > 0) && (
                      <div className="flex gap-2">
                        {labelsData.map((label) => {
                          const isSelected = getLabelIndex(label.id) > -1
                          return (
                            <button
                              key={label.id}
                              type="button"
                              onClick={() => toggleAddLabel(label.id)}
                              className={cn(
                                'opacity-75 rounded-lg active:opacity-65 hover:ring-2 transition',
                                isSelected && 'opacity-100 ring-2')}
                            >
                              <Tag
                                readOnly
                                color={label.color}
                                defaultValue={label.name}
                                className="cursor-default"
                              />
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        <Button type="submit" className="w-32 self-end" disabled={isPending}>
          {isPending ? <Spinner /> : 'Salvar'}
        </Button>
      </form>
    </Form>
  )
}
