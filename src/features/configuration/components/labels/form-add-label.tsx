'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getRandomColor } from '@/lib/utils'
import { Label } from '@prisma/client'
import { toast } from 'sonner'
import { SaveIcon, XIcon } from 'lucide-react'

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Spinner } from '@/components/spinner'
import { Button } from '@/components/ui/button'
import { Tag } from '@/components/ui/tag'

import { createLabelSchema } from '@/features/configuration/schemas/create-label'
import { CreateLabelType } from '@/features/configuration/schemas/create-label'
import { PickColorField } from '@/features/configuration/components/labels/pick-color-field'
import { PickColorButtons } from '@/features/configuration/components/labels/pick-color-buttons'
import { createLabelAction } from '@/features/kanban/actions/labels'

type AddLabelFormProps = {
  onSave: (label: Label) => void
  onClose: VoidFunction
}

export function FormAddLabel({ onSave, onClose }: AddLabelFormProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<CreateLabelType>({
    resolver: zodResolver(createLabelSchema),
    defaultValues: {
      name: '',
      color: getRandomColor(),
    }
  })

  const color = form.watch('color')

  function handleCloseAddLabel() {
    form.reset()
    onClose()
  }

  async function handleSubmit(data: CreateLabelType) {
    startTransition(async () => {
      const { data: label, error } = await createLabelAction(data)

      if (error || !label) {
        toast.error(error || 'Erro ao criar label')
        return
      }

      form.reset()
      onSave(label)
      handleCloseAddLabel()
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex items-center gap-3 border p-1.5 rounded-md mr-2"
        style={{ borderColor: color }}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2" >
              <FormControl>
                <Tag
                  autoFocus
                  readOnly={isPending}
                  value={field.value}
                  color={color}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <PickColorField control={form.control} name="color" />
        <PickColorButtons control={form.control} name="color" />

        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="outline"
            size="icon"
            type="submit"
            className="size-7 opacity-70 hover:opacity-100"
            disabled={isPending}
          >
            {isPending ? <Spinner /> : <SaveIcon />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            type="button"
            className="size-7 opacity-70 hover:opacity-100"
            onClick={handleCloseAddLabel}
          >
            <XIcon />
          </Button>
        </div>
      </form>
    </Form>
  )
}
