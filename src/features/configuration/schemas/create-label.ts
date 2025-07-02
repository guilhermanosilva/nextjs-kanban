import { z } from 'zod'

export const createLabelSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório').max(17, 'Máx. 17 caracteres'),
  color: z.string().min(1, 'Cor obrigatória'),
})

export type CreateLabelType = z.infer<typeof createLabelSchema>
