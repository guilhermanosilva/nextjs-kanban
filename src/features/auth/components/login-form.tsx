"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { login } from "@/features/auth/actions/auth-actions";
import { type LoginForm as LoginFormType, loginSchema } from "@/features/auth/schemas/login-schema";
import { authMessages } from "@/lib/constants/auth-messages";

export function LoginForm() {
  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: LoginFormType) {
    const errorCode = await login(data);

    if (errorCode) {
      const message = authMessages[errorCode] || "Ocorreu um erro inesperado, por favor tente novamente.";
      toast.error(message);
    }
  }

  return (
    <Form {...form}>
      <form className="w-lg space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email:</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha:</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full mt-6" size="lg" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </Form>
  );
}
