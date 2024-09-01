import * as z from "zod";

export const ResetPassFormSchema = z.object({
    email: z.string().email("El formato del mail introducido es incorrecto."),
  });