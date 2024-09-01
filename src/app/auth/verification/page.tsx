import VerificationContent from "@/components/auth/verification-content"
import { Suspense } from "react";

export default async function Verification() {
    
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerificationContent/>
        </Suspense>
    );
}