"use client";

import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserAuthFormSchema } from "@/zod-schemas/user-auth-form-schema";
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
import { loginAction as login, registerAction as register } from "@/actions/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import Link from "next/link";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}


export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isRegistering, setIsRegistering] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>("");
  const [successMessage, setSuccessMessage] = React.useState<string | undefined>("");
  const [infoMessage, setInfoMessage] = React.useState<string | undefined>("");
  const searchParams = useSearchParams();
  const errorParamUrl = searchParams.get('error');

  //If there are error signing in with google this param is set in auth.js
  React.useEffect(() =>{
    if(errorParamUrl === "OAuthAccountNotLinked"){
      setErrorMessage("La cuenta está registrada sin utilizar Google. Inténtelo de nuevo con email y contraseña.");
    }
  }, [errorParamUrl]);
  
  
  const [isPending, startTransition] = React.useTransition();
  const form = useForm<z.infer<typeof UserAuthFormSchema>>({
    mode: "all",
    shouldFocusError: false,
    resolver: zodResolver(UserAuthFormSchema),
    defaultValues: {
      email:"",
      password: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof UserAuthFormSchema>) => {
    setErrorMessage("");
    setSuccessMessage("");
    setInfoMessage("");
    
    startTransition(() => {
      if(!isRegistering){
        login(values)
        .then((res) => {
          setErrorMessage(res?.error);
          setSuccessMessage("");
          setInfoMessage(res?.info ?? "");
        })
      }else{
        register(values)
        .then((res) => {
          setErrorMessage(res.error);
          setSuccessMessage(res.success);

          if(res.ok){
            login(values)
          }
        })
      }
    })
  }

  const onClickGoogle =  ( ) => {
    const provider = "google";
    
    setIsLoading(true);
    startTransition(() => {
      signIn(provider, {
        callbackUrl: DEFAULT_LOGIN_REDIRECT
      }).then((res) => {
        setIsLoading(false);
      })
    })
  }

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
            <div className="grid gap-1 sm:gap-2">
              <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="password" className="text-sm font-semibold">Contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" 
                          placeholder="******" 
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

            <Button type="submit" disabled={isPending} className="w-full py-2 mt-3 sm:mt-4">
              {isPending && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isRegistering ? 'Registrate' : 'Inicia sesión'}
            </Button>
            {!isRegistering && (
              <Button
              variant="link"
              type="button"
              className="w-full text-left h-2 text-slate-500 font-normal"
            >
              <Link href="/auth/reset-password">
                ¿Has olvidado tu contraseña?
              </Link>
              
            </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="relative my-4 sm:my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            O continua con
          </span>
        </div>
      </div>
      <Button variant="outline" onClick={onClickGoogle} type="button" disabled={isLoading} className="w-full py-2 mb-2">
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button>
      <Button
        variant="link"
        type="button"
        onClick={() => setIsRegistering(!isRegistering)}
        className="w-full text-center"
      >
        {isRegistering ? '¿Ya tienes una cuenta? Inicia sesión' : '¿No tienes una cuenta? Regístrate'}
      </Button>
    </div>
  );
}
