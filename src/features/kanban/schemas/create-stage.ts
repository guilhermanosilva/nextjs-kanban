import { z } from "zod";

export const createStageSchema = z.object({
  name: z.string().min(1, "Informe o nome da coluna").max(50, "Informe no máx. 50 caracteres"),
});

export type CreateStage = z.infer<typeof createStageSchema>;
