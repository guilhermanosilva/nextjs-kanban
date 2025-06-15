import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodSchema } from "zod";

import { ActionResponse } from "@/lib/types/action-response";
import { Stage } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateFormData<T>(formData: FormData, schema: ZodSchema<T>): ActionResponse<T> {
  const raw = Object.fromEntries(formData.entries());
  const result = schema.safeParse(raw);

  if (!result.success) {
    const errorMessage = result.error.issues
      .map((issue) => `Campo "${issue.path.join(".")}" inválido: ${issue.message}`)
      .join("; ");

    return { success: false, error: errorMessage, data: null };
  }

  return { success: true, data: result.data };
}

export function getChangedStages(original: Stage[], updated: Stage[]): Stage[] {
  const originalStages = new Map(original.map((stage) => [stage.id, stage.order]));

  return updated
    .map((stage, index) => ({ ...stage, order: index }))
    .filter((updatedStage) => {
      const originalStageOrder = originalStages.get(updatedStage.id);
      return originalStageOrder !== undefined && originalStageOrder !== updatedStage.order;
    });
}
