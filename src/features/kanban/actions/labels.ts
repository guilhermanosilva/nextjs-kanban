'use server'

import { revalidatePath } from 'next/cache'
import { Label as LabelModel } from '@prisma/client'

import { ActionResponse } from '@/lib/types/action-response'
import { getUser } from '@/lib/supabase/server'
import { getZodIssuesString } from '@/lib/utils'
import prisma from '@/lib/prisma'

import { updateLabelSchema, UpdateLabelType } from '@/features/configuration/schemas/update-label'
import { createLabelSchema, CreateLabelType } from '@/features/configuration/schemas/create-label'

export async function getLabelsAction(): Promise<ActionResponse<LabelModel[]>> {
  const { data: user, error } = await getUser()
  if (!user || error) {
    return { success: false, error }
  }

  try {
    const labels = await prisma.label.findMany({
      where: { userId: user.id },
    })

    return { success: true, data: labels }
  } catch {
    return { success: false, error: 'Erro ao buscar "labels"' }
  }
}

export async function createLabelAction(label: CreateLabelType): Promise<ActionResponse<LabelModel>> {

  const { data: user, error } = await getUser()
  if (!user || error) {
    return { success: false, error }
  }

  const validData = createLabelSchema.safeParse(label)
  if (validData.error) {
    return { success: false, error: getZodIssuesString(validData.error.issues) }
  }

  try {
    const label = await prisma.label.create({
      data: {
        name: validData.data.name,
        color: validData.data.color,
        userId: user.id,
      },
    })

    revalidatePath('/')

    return { success: true, data: label }
  } catch {
    return { success: false, error: 'Erro ao salvar etiquetas.' }
  }
}

export async function updateLabelAction(label: UpdateLabelType): Promise<ActionResponse<LabelModel>> {
  const { data: user, error } = await getUser()
  if (!user || error) {
    return { success: false, error }
  }

  const validData = updateLabelSchema.safeParse(label)
  if (validData.error) {
    return { success: false, error: getZodIssuesString(validData.error.issues) }
  }

  try {
    const updatedLabel = await prisma.label.update({
      where: { id: label.id, userId: user.id },
      data: {
        name: validData.data.name,
        color: validData.data.color,
      },
    })

    revalidatePath('/')

    return { success: true, data: updatedLabel }
  } catch {
    return { success: false, error: 'Erro ao atualizar etiqueta.' }
  }
}

export async function deleteLabelAction(id: string): Promise<ActionResponse<void>> {
  const { data: user, error } = await getUser()
  if (!user || error) {
    return { success: false, error }
  }

  try {
    const deletedLabel = await prisma.label.delete({
      where: { id, userId: user.id },
    })

    if (deletedLabel)
      revalidatePath('/')

    return { success: true }
  } catch {
    return { success: false, error: 'Erro ao deletar a tag.' }
  }
}
