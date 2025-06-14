import Link from "next/link";
import { SignupForm } from "@/features/auth/components/signup-form";

export default function SignupPage() {
  console.log("SignupPage");
  return (
    <section className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Cadastrar</h1>
        <p className="text-muted-foreground mb-6">Por favor, insira seu email e senha para se cadastrar.</p>
      </div>

      <SignupForm />

      <Link href="/login" className="font-semibold text-right mt-4 text-sm text-muted-foreground hover:text-primary">
        Já tem uma conta? Entrar
      </Link>
    </section>
  );
}
