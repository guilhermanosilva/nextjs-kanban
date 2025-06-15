import { z } from "zod";

export const updateStagesOrderSchema = z.array(
  z.object({
    id: z.string().cuid(),
    order: z.number().int().nonnegative(),
  }),
);

export type UpdateStagesOrder = z.infer<typeof updateStagesOrderSchema>;
