import LoginFrom from "@/Features/Login/LoginFrom";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/8-prohor-logo.png";
import RingCascade from "@/Features/Login/ProhorLedger";

export default function LoginPage() {
  return (
    <div className="h-screen grid grid-cols-5 overflow-hidden">
      {/* Left — ring cascade panel */}
      <div className="col-span-3 hidden lg:flex flex-col gap-0 justify-between bg-[#0d0d12] px-8 xl:px-10 py-4">
        <Image src={logo} alt="8 Prohor" width={80} height={80} />

        <RingCascade />

        <div>
          <h2 className="text-2xl xl:text-3xl font-bold text-white leading-snug">
            One place to {" "}
            <span className="bg-gradient-to-r from-[#8b5cf6] to-[#14b8a6] bg-clip-text text-transparent">
              plan your day and track your work.
            </span>
          </h2>
          <p className="text-sm text-white/40 mt-1 max-w-md">
            Your tasks, your time and your money, organized in a single calm
            view.
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="col-span-5 lg:col-span-2 flex flex-col justify-center bg-[#fbfaf8] px-8 lg:px-14 overflow-y-auto py-10">
        <div className="mb-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary">
            Welcome back
          </p>
          <h1 className="text-3xl font-bold mt-1">Login to your account</h1>
        </div>
        <LoginFrom />
        <p className="text-sm text-muted-foreground mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
