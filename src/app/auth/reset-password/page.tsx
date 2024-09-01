import ResetPassContent from "@/components/auth/reset-password/reset-pass-content";
import { Suspense } from "react";

export default async function ResetPassword() {

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24">
            <div className="container max-w-md mx-auto flex flex-col items-center justify-center space-y-6 sm:space-y-8">
                <Suspense fallback={<div>Loading...</div>}>
                    <ResetPassContent />
                </Suspense>
            </div>
        </main>
    );
}