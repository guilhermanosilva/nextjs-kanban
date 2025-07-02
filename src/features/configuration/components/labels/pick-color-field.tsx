'use client'

import { Control, FieldPath, FieldValues } from 'react-hook-form'
import { Pipette } from 'lucide-react'
import { getContrastColor } from '@/lib/utils'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

type Props<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
}

export function PickColorField<T extends FieldValues>({ control, name }: Props<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-2">
          <FormControl>
            <div className="relative">
              <FormLabel
                htmlFor="color-picker"
                className="cursor-pointer absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ color: getContrastColor(field.value) }}>
                <Pipette className="size-4 opacity-70" />
              </FormLabel>

              <Input
                id="color-picker"
                type="color"
                title="Cor personalizada"
                className="shadow-none ring-0 size-7 p-0 cursor-pointer rounded-sm border-none"
                value={field.value}
                onChange={field.onChange}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
