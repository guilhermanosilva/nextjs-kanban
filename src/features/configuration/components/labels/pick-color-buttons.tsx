'use client'

import { Control, FieldPath, FieldValues } from 'react-hook-form'
import { COLORS } from '@/lib/constants/colors'
import { cn } from '@/lib/utils'

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'

type Props<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
}

export function PickColorButtons<T extends FieldValues>({ control, name }: Props<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-2">
          <FormControl>
            <div className="flex items-center flex-1 gap-1.5">
              {COLORS.map((color) => (
                <Button
                  key={color}
                  type="button"
                  title={color}
                  style={{ backgroundColor: color }}
                  onClick={() => field.onChange(color)}
                  className={cn(
                    'size-5 p-0 cursor-pointer rounded-full inset-ring-2 inset-ring-primary/30 transition-all hover:scale-110',
                    field.value === color && 'inset-ring-primary',
                  )}
                />
              ))}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
