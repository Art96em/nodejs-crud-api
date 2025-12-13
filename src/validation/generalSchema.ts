import { z } from "zod";

export const uuidParamSchema = z.object({
  id: z.uuid("Invalid format"),
});

export type UuidParamDTO = z.infer<typeof uuidParamSchema>;
