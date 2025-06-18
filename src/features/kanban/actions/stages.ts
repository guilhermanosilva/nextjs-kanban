"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { Stage } from "@prisma/client";

import { ActionResponse } from "@/lib/types/action-response";
import { getUser } from "@/lib/supabase/server";
import { validateFormData } from "@/lib/utils";

import { createStageSchema } from "@/features/kanban/schemas/create-stage";
import { type UpdateStagesOrder, updateStagesOrderSchema } from "@/features/kanban/schemas/update-stage";

export async function getStagesAction(): Promise<ActionResponse<Stage[]>> {
  try {
    const { data: user, error } = await getUser();
    if (error || !user) {
      return { success: false, error };
    }

    const stages = await prisma.stage.findMany({
      where: { userId: user.id },
    });

    return { success: true, data: stages };
  } catch {
    return { success: false, error: 'Erro ao buscar "stages"' };
  }
}

export async function createStageAction(formData: FormData): Promise<ActionResponse<Stage>> {
  try {
    const user = await getUser();
    if (!user.data || user.error) {
      return { success: false, error: user.error };
    }

    const stages = await getStagesAction();
    if (!stages.data || stages.error) {
      return { success: false, error: stages.error };
    }

    const validData = validateFormData(formData, createStageSchema);
    if (validData.error) {
      return { success: false, error: validData.error };
    }

    const stage = await prisma.stage.create({
      data: {
        name: validData.data!.name,
        userId: user.data.id,
        order: stages.data.length,
      },
    });

    revalidatePath("/");

    return { success: true, data: stage };
  } catch {
    return { success: false, error: 'Erro ao criar "stage"' };
  }
}

export async function updateStagesOrderAction(stagesOrder: UpdateStagesOrder): Promise<ActionResponse<Stage[]>> {
  try {
    const { data: user, error } = await getUser();
    if (error || !user) {
      return { success: false, error };
    }

    const validated = updateStagesOrderSchema.safeParse(stagesOrder);
    if (!validated.success) {
      return { success: false, error: "Dados de ordenação inválidos." };
    }

    const tx = validated.data.map((stage) =>
      prisma.stage.update({
        where: { id: stage.id, userId: user.id },
        data: { order: stage.order },
      }),
    );

    const stages = await prisma.$transaction(tx);

    return { success: true, data: stages };
  } catch {
    return { success: false, error: "Erro ao atualizar a ordem das colunas." };
  }
}
