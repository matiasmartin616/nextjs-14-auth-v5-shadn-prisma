"use client";

import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormStep,
} from "@/components/ui/form/form";
import { FormError } from "@/components/ui/form/form-error";
import { FormSuccess } from "@/components/ui/form/form-success";
import { FormInfo } from "@/components/ui/form/form-info";
import { resetPasswordAction as resetPassword } from "@/actions/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { ResetPassFormSchema } from "@/zod-schemas/reset-pass-form-schema";
import Link from "next/link";

interface ResetPassFormProps extends React.HTMLAttributes<HTMLDivElement> {}


export function ResetPassForm({ className, ...props }: ResetPassFormProps) {
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>("");
  const [successMessage, setSuccessMessage] = React.useState<string | undefined>("");
  const [infoMessage, setInfoMessage] = React.useState<string | undefined>("");
  const searchParams = useSearchParams();
  const errorParamUrl = searchParams.get('error');
  const [emailSent, setEmailSent] = React.useState<boolean>(false);
  const [timer, setTimer] = React.useState<number | null>(null);

  //If there are error signing in with google this param is set in auth.js
  React.useEffect(() =>{
    if(errorParamUrl === "OAuthAccountNotLinked"){
      setErrorMessage("La cuenta está registrada sin utilizar Google. Inténtelo de nuevo con email y contraseña.");
    }
  }, [errorParamUrl]);
  
  
  const [isPending, startTransition] = React.useTransition();
  const form = useForm<z.infer<typeof ResetPassFormSchema>>({
    mode: "all",
    shouldFocusError: false,
    resolver: zodResolver(ResetPassFormSchema),
    defaultValues: {
      email:""
    }
  });

  const onSubmit = async (values: z.infer<typeof ResetPassFormSchema>) => {
    setErrorMessage("");
    setSuccessMessage("");
    setInfoMessage("");
    
    startTransition(() => {
        resetPassword(values)
        .then((res) => {
          setErrorMessage(res.error);
          setSuccessMessage(res.success);
          if (res.success) {
            setEmailSent(true); // Deshabilita el botón
            setTimer(30); // Inicia el temporizador de 30 segundos
          }
        })
    })
  }

  React.useEffect(() => {
    if (timer === null) return;

    const interval = setInterval(() => {
      setTimer((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    if (timer <= 0) {
      clearInterval(interval);
      setEmailSent(false); // Habilita el botón de nuevo
      setTimer(null); // Resetea el timer
    }

    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className={cn("grid gap-4 p-4 sm:gap-6 sm:p-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <div className="grid gap-3 sm:gap-4">
            <div className="grid gap-1 sm:gap-2">
              <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email" className="text-sm font-semibold">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="john.martinez@example.com" 
                          {...field}
                          disabled={isPending} />
                      </FormControl>
                      <FormMessage className="text-xs"/>
                    </FormItem>
                  )}
                />
            </div>

            <FormError message={errorMessage}></FormError>
            <FormSuccess message={successMessage}></FormSuccess>
            <FormInfo message={infoMessage}></FormInfo>

            <Button type="submit" disabled={(isPending || emailSent)} className="w-full py-2 mt-3 sm:mt-4">
              {isPending && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {emailSent ? `Volver a enviar en ${timer}s`  : "Enviar email de recuperación"}
            </Button>
              
            <Button
                variant="link"
                className="font-normal w-full flex items-center justify-start text-left"
                size="sm"
                asChild
                >
                <Link href={"/"} className="text-left">
                   🔙 Volver a inicio de sesión
                </Link>
            </Button>
            
          </div>
        </form>
      </Form>
    </div>
  );
}
