import RegisterForm from "@/Features/Register/RegisterForm";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/8-prohor-logo.png";
import ProhorDial from "@/Features/Register/ProhorDial";

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid grid-cols-5">
      <div className="col-span-3 hidden lg:flex flex-col justify-between bg-[#140f1f] text-[#ece6fb] p-8 relative overflow-hidden">
        <div className="relative z-10">
          <Image
            src={logo}
            alt="8 Prohor"
            width={100}
            height={100}
            className="mb-2"
          />
          <p className="mt-2 text-xs font-mono text-[#a78bfa] tracking-[0.2em] uppercase">
            The Eight Watches of the Day
          </p>
        </div>

        <div className="relative z-10 self-center">
          <ProhorDial />
        </div>

        <p className="relative mt-6 z-10 text-xs font-mono text-[#a78bfa]/60 max-w-sm leading-relaxed">
          Est. in tradition — the day divided into eight watches of three hours
          each, a discipline older than the clock.
        </p>
      </div>

      <div className="col-span-5 lg:col-span-2 flex flex-col justify-center bg-[#fbfaf8] px-8 lg:px-14">
        <div className="mb-6">
          <p className="text-xs font-mono tracking-[0.2em] uppercase text-primary">
            Get started
          </p>
          <h1 className="font-serif text-3xl mt-1">Create your account</h1>
        </div>
        <RegisterForm />
        <p className="text-sm text-muted-foreground mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
