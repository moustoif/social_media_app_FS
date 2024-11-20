import { Metadata } from "next";
import Image from "next/image";
import etudiantScience from "@/assets/etudiants_science.jpg"
import Link from "next/link";
import SignUpForm from "./SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center p-6">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="md:w-1/2 w-full space-y-3 overflow-y-auto p-6">
            <div className="space-y-1 text-center">
                <h1 className="text-3xl font-bold">Let&apos;s start your adventure to <span className="text-green-600">inSiansa</span></h1>
                <p className="text-muted-foreground">
                    A place where even <span className="italic">you</span> can find friends.
                </p>
            </div>
            <div className="space-y-5">
                <SignUpForm/>
                <Link href="/login" className="block text-center hover:underline">
                    Already have an account? Log in then.
                </Link>
            </div>
        </div>
        <Image
        src={etudiantScience}
        alt= ""
        className="w-1/2 hidden object-cover md:block"
        />
      </div>
    </main>
  );
}
