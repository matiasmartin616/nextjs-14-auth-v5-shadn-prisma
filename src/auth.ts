import NextAuth, { DefaultSession } from "next-auth"
import authConfig from "@/auth.config"
import prisma from "@/lib/prisma"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { getUserById } from "@/entitys/user"
import { UserRole } from "@prisma/client"
import { getUserByEmail } from "@/entitys/user";

export const {
    handlers: {GET, POST},
    auth,
    signIn,
    signOut 
} = NextAuth ({
    pages: {
        signIn: '/',
        error:'/'
    },
    events: {
        //When an user signs in with Google it executes
        async linkAccount({user}){
            await prisma.user.update({
                where: {id: user.id},
                data: {emailVerified: new Date()}

            })
        }
    },
    callbacks:{
        async signIn({user, account}){
            if(account?.provider !== "credentials") return true;

            const email = user.email ?? "";
            const existingUser = await getUserByEmail(email);

            //Prevent sign in without email verification
            if(!existingUser?.emailVerified) return false;

            return true;
        },
        async redirect({ url, baseUrl }) {
            // Redirects to login with a param if google session error. It should work with github
            if (url.includes('OAuthAccountNotLinked')) {
                return `${baseUrl}/?error=OAuthAccountNotLinked`;
            }
            return url.startsWith(baseUrl) ? url : baseUrl;
        },
        async session ({ token, session }) {
            if(token.sub && session.user){
                session.user.id = token.sub;
            }

            if(token.role && session.user){
                session.user.role = token.role as UserRole;
            }

            return session
        },
        async jwt ({token}) {
            if (!token.sub) return token;

            const existingUser = await getUserById(token.sub)
            
            if (!existingUser) return token;
            
            token.role = existingUser.role;

            return token;
        },

    },
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    ...authConfig
})