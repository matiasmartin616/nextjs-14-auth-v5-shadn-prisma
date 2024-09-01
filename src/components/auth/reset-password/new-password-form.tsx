"use client";

import { Icons } from "@/components/icons/icons";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormStep,
} from "@/components/ui/form/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/ui/form/form-error";
import { FormInfo } from "@/components/ui/form/form-info";
import { FormSuccess } from "@/components/ui/form/form-success";
import { cn } from "@/lib/utils";
import { NewPassFormSchema } from "@/zod-schemas/new-pass-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import React from "react";
import * as z from "zod";

interface NewPassFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function NewPasswordForm({ className, ...props }: NewPassFormProps) {
    const [errorMessage, setErrorMessage] = React.useState<string | undefined>("");
    const [successMessage, setSuccessMessage] = React.useState<string | undefined>("");
    const [infoMessage, setInfoMessage] = React.useState<string | undefined>("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = React.useTransition();
    const [isPassUpdated, setIsPassUpdated] = React.useState<boolean | undefined>(false);
    const form = useForm<z.infer<typeof NewPassFormSchema>>({
        mode: "all",
        shouldFocusError: false,
        resolver: zodResolver(NewPassFormSchema),
        defaultValues: {
          password:"",
          confirmPassword: ""
        }
    })


    const onSubmit = async (values: z.infer<typeof NewPassFormSchema>) => {
        setErrorMessage("");
        setSuccessMessage("");
        setInfoMessage("");
        const token = searchParams.get('token');
        const domain = window.location.origin;
        const { password: newPassword } = values;
        
        startTransition(async () => {
            const res = await fetch(`${domain}/api/auth/reset-pass`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: token, password: newPassword }),
            });
            
            const data = await res.json();
            
            setErrorMessage(!data.ok && data.message);
            setSuccessMessage(data.ok && "Has cambiado la contraseña con éxito. Redirigiendo al inicio de sesión...");
            setIsPassUpdated(data.ok);
            setTimeout(() => {
                router.push("/");
              }, 3000);
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
            <div className="grid gap-1 sm:gap-2">
              <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="confirmPassword" className="text-sm font-semibold">Confirma tu contraseña</FormLabel>
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

            {!isPassUpdated && (
                <Button type="submit" disabled={(isPending)} className="w-full py-2 mt-3 sm:mt-4">
                    {isPending && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Cambiar contraseña
                </Button>
            )}
            {!isPassUpdated && (
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
            )}

            

          </div>
        </form>
      </Form>
    </div>
  );
}