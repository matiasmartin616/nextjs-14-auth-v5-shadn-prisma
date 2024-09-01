import type { NextApiRequest } from 'next'
import { NextResponse } from 'next/server';
import { generateResetPassToken, getResetPassTokenByToken } from '@/entitys/token'; 
import { getUserByEmail} from '@/entitys/user';
import prisma from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/mail';
import bcrypt from 'bcryptjs';
import { setNewPassword } from '@/entitys/session';

export async function POST (req: any) {
    const { token } = await req.json();
    const existingToken = await getResetPassTokenByToken(token);

    if(!existingToken){
        return NextResponse.json({ message: `Token inválido`, ok: false }, { status: 403 });
    }
    
    const hasExpired = new Date(existingToken.expires) < new Date();

    if  (hasExpired){
        const verificationToken = await generateResetPassToken(
            existingToken.email,
        );
    
        await sendVerificationEmail(verificationToken.email, verificationToken.token);
        
        return NextResponse.json({ message: `El token ha expirado. Hemos enviado otro enlace a tu correo.`, ok: false }, { status: 403 });
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if(!existingUser){
        return NextResponse.json({ message: `El email no existe`, ok: false }, { status: 403 });
    }

    if(existingUser.emailVerified){
        return NextResponse.json({ message: `El email ha sido verificado.`, ok: true }, { status: 201 });
    }

    await prisma.user.update ({
        where: { id : existingUser?.id},
        data: {
            emailVerified: new Date(),
            email: existingToken.email
        }
    })

    await prisma.verificationToken.delete({
        where: { id: existingToken.id }
    });

    return NextResponse.json({ message: `Email verificado con éxito.`, ok: true }, { status: 201 });
}

export async function PUT (req: any) {
    const body = await req.json();
    const { token, password } = body
    
    return setNewPassword(token, password);
}