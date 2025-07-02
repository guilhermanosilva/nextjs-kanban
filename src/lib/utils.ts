import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ZodIssue, ZodSchema } from 'zod'

import { COLORS } from '@/lib/constants/colors'
import { ActionResponse } from '@/lib/types/action-response'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getZodIssuesString(issues: ZodIssue[]): string {
  return issues.map((issue) => `Campo "${issue.path.join('.')}" inválido: ${issue.message}`).join('; ')
}

export function validateFormData<T>(formData: FormData, schema: ZodSchema<T>): ActionResponse<T> {
  const raw = Object.fromEntries(formData.entries())
  const result = schema.safeParse(raw)

  if (!result.success) {
    const errorMessage = getZodIssuesString(result.error.issues)

    return { success: false, error: errorMessage, data: null }
  }

  return { success: true, data: result.data }
}


export function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

export function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace('#', '')

  const r = Number.parseInt(hex.slice(0, 2), 16)
  const g = Number.parseInt(hex.slice(2, 4), 16)
  const b = Number.parseInt(hex.slice(4, 6), 16)

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  return luminance > 0.65 ? '#000000cc' : '#ffffff'
}
