import { Metadata } from "next";
import LoginForm from "./LoginForm";
import Link from "next/link";
import Image from "next/image";
import loginImage from "@/assets/fac_science.jpg";

export const metadata: Metadata = {
    title: "Login"

}

export default function Page() {
    return ( <main className="flex h-screen items-center justify-center p-6">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="md:w-1/2 w-full space-y-10 overflow-y-auto p-10">
            <div className="space-y-1 text-center">
                <h1 className="text-3xl font-bold">
                  Welcome to <span className="text-green-600">inSiansa</span>
                </h1>
                <p className="text-muted-foreground">
                    A place where students like <span className="italic">you</span> unite <br /> and support each other.
                </p>
            </div>
            <div className="space-y-5">
                <LoginForm/>
                <Link href="/signup" className="block text-center hover:underline">
                Don&apos;t have an account yet? Let&apos;s Sign up then
                </Link>
            </div>
        </div>
        <Image
        src={loginImage}
        alt= ""
        className="w-1/2 hidden object-cover md:block"
        />
      </div>
    </main>
  );
}