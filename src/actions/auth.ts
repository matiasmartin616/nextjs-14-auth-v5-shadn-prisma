"use server"
import { UserAuthFormSchema } from "@/zod-schemas/user-auth-form-schema"
import { ResetPassFormSchema } from "@/zod-schemas/reset-pass-form-schema";
import * as z from "zod"
import { login, register, resetPassword } from '@/entitys/session';


export async function loginAction(data: { email: string, password: string }) {
    return await login(data);
}

export const registerAction = async (data : z.infer<typeof UserAuthFormSchema>) => {
    return await register(data);
}

export const resetPasswordAction = async (data : z.infer<typeof ResetPassFormSchema>) => {
    return await resetPassword(data);
}