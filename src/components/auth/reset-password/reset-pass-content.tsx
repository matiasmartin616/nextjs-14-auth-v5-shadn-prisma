"use client";

import { ResetPassForm } from "@/components/auth/reset-password/reset-pass-form";
import { useSearchParams } from "next/navigation";
import router from "next/router";
import { useEffect } from "react";
import NewPasswordForm from "./new-password-form";

interface ResetPassContentProps 
extends React.HTMLAttributes<HTMLDivElement> 
{
  //param: string
}

export default function ResetPassContent({ ...props} : ResetPassContentProps) {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  return (
        <div className="mx-auto w-full flex flex-col justify-center space-y-4 sm:space-y-6">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                Recuperar credenciales
              </h1>
              <p className="text-sm text-muted-foreground sm:text-base">
                { token ? "Restablece tu contraseña": "Recupera tu contraseña"}
              </p>
            </div>
            {token 
            ? <NewPasswordForm />
            : <ResetPassForm />
            }
            
        </div>
  );
}