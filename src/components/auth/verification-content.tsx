"use client";

import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";

export default function VerificationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Tu email está siendo verificado...');
  const [responseOk, setResponseOk] = useState(false);

  const handleClick = () => {
    router.push("/");
  }

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setMessage('Token no encontrado');
        setLoading(false);
        return;
      }

      try {
        const domain = window.location.origin;
        const response = await fetch(`${domain}/api/auth/new-verification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();
        
        setTimeout(() => {
          if (data.ok) {
            setMessage('Email verificado con éxito.');
          } else {
            setMessage(data.message || 'Error al verificar el email.');
          }
          
          setResponseOk(data?.ok ?? false)
          setLoading(false);
        }, 2000);

      } catch (error) {
        console.log(error)
        setMessage('Error al conectar con el servidor.');
      } finally {
        setTimeout(() => {
          setLoading(false);
          router.push("/");
        }, 3000);
      }
    };
    verifyEmail();
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="m-3">{message}</h1>
      {loading && (
        <PulseLoader
          color="#3c99b6"
          loading
          size={20}
          speedMultiplier={0.8}
          margin={2}
        />
      )}

      {responseOk && (
        <Button onClick={handleClick}>Inicia sesión</Button>
      )}
    </div>
  );
}