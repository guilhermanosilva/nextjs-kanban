import Link from "next/link";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <section className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Entrar</h1>
        <p className="text-muted-foreground mb-6">Por favor, insira seu email e senha para entrar.</p>
      </div>

      <LoginForm />

      <Link href="/signup" className="font-semibold text-right mt-4 text-sm text-muted-foreground hover:text-primary">
        Não tem uma conta? Cadastre-se
      </Link>
    </section>
  );
}
