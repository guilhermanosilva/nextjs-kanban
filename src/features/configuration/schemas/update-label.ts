import { z } from 'zod'

export const updateLabelSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Nome obrigatório').max(17, 'Máx. 17 caracteres'),
  color: z.string().min(1, 'Cor obrigatória'),
})

export type UpdateLabelType = z.infer<typeof updateLabelSchema>
