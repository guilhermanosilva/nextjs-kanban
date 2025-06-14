"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { authMessages } from "@/lib/constants/auth-messages";
import { LoginForm } from "@/features/auth/schemas/login-schema";
import { SignupForm } from "@/features/auth/schemas/signup-schema";

export async function login({ email, password }: LoginForm) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return error.code as keyof typeof authMessages;

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup({ email, password }: SignupForm) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) return error.code as keyof typeof authMessages;
}

export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) return error.message;
}
