import bcrypt from 'bcryptjs';
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { UserAuthFormSchema } from '@/zod-schemas/user-auth-form-schema';
import { getUserByEmail } from "@/entitys/user";
import Google from "next-auth/providers/google"

export default {
    trustHost: true,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        Credentials ({
            async authorize (credentials, request) {
                const validatedFields = UserAuthFormSchema.safeParse(credentials);

                if(validatedFields.success) {
                    const { email, password } = validatedFields.data;

                    const user = await getUserByEmail(email)

                    if (!user || !user.password) return null;

                    const passwordsMatch = await bcrypt.compare(
                        password,
                        user.password
                    )

                    if (passwordsMatch) return user;
                    
                }
                
                return null;
            }
        })
    ],
} satisfies NextAuthConfig