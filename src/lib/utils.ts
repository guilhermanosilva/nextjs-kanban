import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ZodIssue, ZodSchema } from 'zod'

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
