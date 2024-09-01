import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

export const generateVerificationToken = async (email: string) => {
    const token = uuidv4(); 
    const expires = new Date (new Date().getTime() + 3600 * 1000);

    const existingToken = await getVerificationTokenByEmail(email);

    if(existingToken) {
        await prisma.verificationToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }

    const verificationToken = await prisma.verificationToken.create({
        data: {
            email,
            token,
            expires
        }
    })

    return verificationToken;
}

export const getVerificationTokenByEmail = async (email: string) => {

    try{
        const token = await prisma.verificationToken.findFirst({
            where: {email}
        })
        
        return token;

    }catch (e){
        return null
    }
}

export const getVerificationTokenByToken = async (token: string) => {

    try{
        const verificationToken = await prisma.verificationToken.findUnique({
            where: {token}
        })
        
        return verificationToken;

    }catch (e){
        return null
    }
}


export const generateResetPassToken = async (email: string) => {
    const token = uuidv4(); 
    const expires = new Date (new Date().getTime() + 3600 * 1000);

    const existingToken = await getResetPassTokenByEmail(email);

    if(existingToken) {
        await prisma.resetPassToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }

    const resetPassToken = await prisma.resetPassToken.create({
        data: {
            email,
            token,
            expires
        }
    })

    return resetPassToken;
}

export const getResetPassTokenByToken = async (token: string) => {

    try{
        const resetPassToken = await prisma.resetPassToken.findUnique({
            where: {token}
        })
        
        return resetPassToken;

    }catch (e){
        return null
    }
}

export const getResetPassTokenByEmail = async (email: string) => {

    try{
        const token = await prisma.resetPassToken.findFirst({
            where: {email}
        })
        
        return token;

    }catch (e){
        return null
    }
}