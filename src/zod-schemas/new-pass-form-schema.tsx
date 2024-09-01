import * as z from "zod";

export const NewPassFormSchema = z.
  object({
    password: z
      .string()
      .min(8, { message: "La contraseña introducida debe tener más de 8 caracteres." })
      .max(100, { message: "La contraseña introducida debe tener menos de 100 caracteres." })
      .regex(/[a-z]/, { message: "La contraseña debe contener al menos una letra minúscula." })
      .regex(/[A-Z]/, { message: "La contraseña debe contener al menos una letra mayúscula." })
      .regex(/[0-9]/, { message: "La contraseña debe contener al menos un número." })
      .regex(/[^a-zA-Z0-9]/, { message: "La contraseña debe contener al menos un carácter especial." }),
    confirmPassword: z.string(), // Añadimos el campo para confirmar la contraseña
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"], // Aplica el mensaje de error al campo de confirmación
  });