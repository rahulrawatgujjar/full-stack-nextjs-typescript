import { z } from "zod";


export const verifySchema = z.object({
  code: z
    .string()
    .regex(/^[0-9]+$/, "Verification code must only have numbers")
    .length(6, "Verification code must have 6 digits")
})