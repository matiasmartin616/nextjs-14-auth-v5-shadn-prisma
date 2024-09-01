// src/entitys/session.ts
import { UserAuthFormSchema } from "@/zod-schemas/user-auth-form-schema"
import * as z from "zod"
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { getUserByEmail } from "@/entitys/user";
import { signIn } from "@/auth"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth"
import { generateResetPassToken, generateVerificationToken, getResetPassTokenByToken } from "@/entitys/token";
import { sendResetPassEmail, sendVerificationEmail } from "@/lib/mail";
import { ResetPassFormSchema } from "@/zod-schemas/reset-pass-form-schema";
import { NewPassFormSchema } from "@/zod-schemas/new-pass-form-schema";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const login = async (data : z.infer<typeof UserAuthFormSchema>) => {
    const validatedData = UserAuthFormSchema.safeParse(data)

    if (!validatedData.success){
        return { error: "Los campos son inválidos." }
    }
    
    const { email, password } = validatedData.data;
    
    const existingUser = await getUserByEmail(email);

    if(!existingUser || !existingUser.email ){
        return { error: "Este email no está asociado a ningún usuario existente." }
    }
    
    //if user has logged in with google he will have no password
    if(!existingUser.password){
        return { error: "Este usuario ha sido creado mediante el inicio de sesión de Google. Accede con el botón de Google. " }
    }

    if(!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(
            existingUser.email,
        );

        await sendVerificationEmail(verificationToken.email, verificationToken.token);
        return { info: "Este email no ha sido verificado. Revisa tu correo para acceder, hemos enviado un enlace de confirmación.", ok:true}
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        })

    } catch (error) {
        if( error instanceof AuthError ){
            switch(error.type){
                case "CredentialsSignin":
                    return { error: "Credenciales inválidos." }
                
                default: 
                    return { error: "Algo ha ido mal."}
            }
        }
        
        console.error(error);
        throw error;
    }
}

export const register = async (data : z.infer<typeof UserAuthFormSchema>) => {
    const validatedData = UserAuthFormSchema.safeParse(data)

    if (!validatedData.success){
        return { error: "Campos invalidos" }
    }

    const { email, password } = validatedData.data;
    
    const existingUser = await getUserByEmail(email);
    if(existingUser) return { error: 'El usuario ya está registrado.' };
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
    data: {
        email,
        password: hashedPassword,
    },
    });

    const verificationToken = await generateVerificationToken(user.email ?? "");

    try{
        await sendVerificationEmail(verificationToken.email, verificationToken.token);
    
    }catch (e){
        return { error: "Error en el servidor." , ok: false}
    }
    
    return { success: "¡Email de confirmación enviado!. Revisa tu correo para acceder. " , ok: false}
    
}

export const resetPassword = async (data : z.infer<typeof ResetPassFormSchema>) => {
    const validatedData = ResetPassFormSchema.safeParse(data)

    if (!validatedData.success){
        return { error: "Campos invalidos" }
    }

    const { email } = validatedData.data;
    
    const existingUser = await getUserByEmail(email);
    if(!existingUser) return { error: 'Email no encontrado.' };

    const resetPassToken = await generateResetPassToken(existingUser.email ?? "");

    try{
        await sendResetPassEmail(resetPassToken.email, resetPassToken.token);
    
    }catch (e){
        return { error: "Error en el servidor." , ok: false}
    }
    
    return { success: "¡Email para cambiar tu contraseña enviado!. Revisa tu correo para acceder. " , ok: true}
    
}

export const setNewPassword = async (token: string, password:string) => {
    
    const existingToken = await getResetPassTokenByToken(token);

    if(!existingToken){
        return NextResponse.json({ message: `El token que ha proporcionado es incorrecto. Por favor, acceda desde el enlace de su correo`, ok: false }, { status: 403 });
    }
    
    const hasExpired = new Date(existingToken.expires) < new Date();

    if  (hasExpired){
        const resetPassToken = await generateResetPassToken(
            existingToken.email,
        );
    
        await sendResetPassEmail(resetPassToken.email, resetPassToken.token);
        
        return NextResponse.json({ message: `El token ha expirado. Hemos enviado otro enlace a tu correo.`, ok: false }, { status: 403 });
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if(!existingUser){
        return NextResponse.json({ message: `El email no existe`, ok: false }, { status: 403 });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update ({
        where: { id : existingUser?.id},
        data: {
            password: hashedPassword
        }
    })

    await prisma.resetPassToken.deleteMany({
        where: { email: existingToken.email }
    });

    return NextResponse.json({ message: `¡Has cambiado la contraseña con éxito!`, ok: true }, { status: 201 });
}