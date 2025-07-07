import { Prisma } from '@prisma/client'

export const includeFields = {
  cardLabel: {
    include: {
      label: true
    }
  }
}

export type CardWithLabels = Prisma.CardGetPayload<{ include: typeof includeFields }>
