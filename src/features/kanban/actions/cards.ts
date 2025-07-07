'use server'

import { revalidatePath } from 'next/cache'
import { Card } from '@prisma/client'

import { ActionResponse } from '@/lib/types/action-response'
import { getUser } from '@/lib/supabase/server'
import { getZodIssuesString } from '@/lib/utils'
import prisma from '@/lib/prisma'

import { type CreateCardForm, createCardSchema } from '@/features/kanban/schemas/create-card'
import { type CardWithLabels, includeFields } from '@/features/kanban/schemas/get-card'

export async function getCardsAction(): Promise<ActionResponse<CardWithLabels[]>> {
  try {
    const user = await getUser()
    if (!user.data || user.error) {
      return { success: false, error: user.error }
    }

    const cards = await prisma.card.findMany({
      where: { userId: user.data.id },
      include: includeFields,
      orderBy: { order: 'asc', },
    })

    return { success: true, data: cards }
  } catch {
    return { success: false, error: 'Erro ao buscar "cards"' }
  }
}

export async function getCardsByStageAction(stageId: string): Promise<ActionResponse<Card[]>> {
  try {
    const cards = await prisma.card.findMany({
      where: { stageId },
    })

    return { success: true, data: cards }
  } catch {
    return { success: false, error: 'Erro ao buscar "cards"' }
  }
}

export async function createCardAction(formData: CreateCardForm): Promise<ActionResponse<Card>> {
  try {
    const { data: user, error } = await getUser()
    if (!user || error) {
      return { success: false, error }
    }

    const cardsByStage = await getCardsByStageAction(formData.stageId)
    if (!cardsByStage.data || cardsByStage.error) {
      return { success: false, error: cardsByStage.error }
    }

    const validData = createCardSchema.safeParse({
      userId: user.id,
      stageId: formData.stageId,
      title: formData.title,
      description: formData.description,
      order: cardsByStage.data.length,
      cardLabel: formData.cardLabel,
    })

    if (validData.error) {
      return { success: false, error: getZodIssuesString(validData.error.issues) }
    }

    const card = await prisma.$transaction(async (tx) => {
      const card = await tx.card.create({
        data: {
          userId: user.id,
          order: cardsByStage.data?.length,
          title: validData.data.title,
          stageId: validData.data.stageId,
          description: validData.data.description,
        },
      })

      await tx.cardLabel.createMany({
        data: validData.data.cardLabel.map((label) => ({
          labelId: label.labelId!,
          cardId: card.id,
        })),
      })

      return card
    })

    revalidatePath('/')

    return { success: true, data: card }
  } catch {
    return { success: false, error: 'Erro ao criar "stage"' }
  }
}

export async function updateCardAction(previousData: Partial<Card>, newFormData: CreateCardForm): Promise<ActionResponse<Card>> {
  try {
    const user = await getUser()
    if (!user.data || user.error) {
      return { success: false, error: user.error }
    }

    const validData = createCardSchema.safeParse({
      userId: user.data.id,
      stageId: newFormData.stageId,
      title: newFormData.title,
      description: newFormData.description,
      order: previousData.order,
      cardLabel: newFormData.cardLabel,
    })

    if (validData.error) {
      return { success: false, error: getZodIssuesString(validData.error.issues) }
    }

    const card = await prisma.$transaction(async (tx) => {
      const card = await tx.card.update({
        where: { id: previousData.id },
        data: {
          title: validData.data.title,
          description: validData.data.description,
          stageId: validData.data.stageId,
          order: previousData.order,
        },
      })

      await tx.cardLabel.deleteMany({
        where: { cardId: card.id },
      })

      if (validData.data.cardLabel?.length > 0) {
        await tx.cardLabel.createMany({
          data: validData.data.cardLabel.map((label) => ({
            labelId: label.labelId!,
            cardId: card.id,
          })),
        })
      }

      return card
    })

    revalidatePath('/')

    return { success: true, data: card }
  } catch {
    return { success: false, error: 'Erro ao atualizar "card"' }
  }
}

export async function updateCardsOrderAction(cards: Card[]) {
  try {
    const { data: user, error } = await getUser()
    if (!user || error) {
      return { success: false, error }
    }

    const tx = cards.map((card) =>
      prisma.card.update({
        where: { id: card.id, userId: user.id },
        data: { order: card.order, stageId: card.stageId, updatedAt: new Date() },
      }),
    )

    const response = await prisma.$transaction(tx)

    revalidatePath('/')

    return { success: true, data: response }
  } catch {
    return { success: false, error: 'Erro ao atualizar "cards"' }
  }
}
