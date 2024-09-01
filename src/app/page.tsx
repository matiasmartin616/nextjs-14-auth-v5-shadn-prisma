import { Metadata } from 'next';
import { UserAuthForm } from '@/components/auth/user-auth-form';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.',
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24">
      <div className="container max-w-md mx-auto flex flex-col items-center justify-center space-y-6 sm:space-y-8">
        <div className="mx-auto w-full flex flex-col justify-center space-y-4 sm:space-y-6">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              ¡Hola!
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Inicia sesión o crea una cuenta
            </p>
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <UserAuthForm />
          </Suspense>

          <p className="px-4 text-center text-xs text-muted-foreground sm:px-8 sm:text-sm">
            Al continuar aceptas nuestros{' '}
            <a
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Términos de servicio
            </a>{' '}
            y nuestra {' '}
            <a
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Política de privacidad
            </a>.
          </p>
        </div>
      </div>
    </main>
  );
}
