import VerifyOtpForm from "@/Features/VerifyOtp/VerifyOtpForm";
import { Suspense } from "react";

export default function VerifyOtpPage() {
  return (
    <div className="grid grid-cols-5 min-h-screen justify-center items-center gap-4 p-10">
      <div className="col-span-3"></div>
      <div className="col-span-2">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-primary">Verify OTP</h1>
        </div>
        <Suspense fallback={<p className="text-center">Loading...</p>}>
          <VerifyOtpForm />
        </Suspense>
      </div>
    </div>
  );
}
