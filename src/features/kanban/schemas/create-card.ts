import { z } from 'zod'

export const createCardSchema	= z.object({
  userId: z.string(),
  stageId: z.string(),
	title: z.string().min(1, 'Informe o título da tarefa').max(50, 'Informe no máx. 50 caracteres'),
	description: z.string().nullable(),
  order: z.coerce.number().int().nonnegative({ message: 'Números negativos não são permitidos' }),
})

export const createCardFormSchema = createCardSchema.pick({ title: true, description: true, stageId: true })

export type CreateCard = z.infer<typeof createCardSchema>;
export type CreateCardForm = z.infer<typeof createCardFormSchema>;
