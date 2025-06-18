"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { logout } from "@/features/auth/actions/auth-actions";
import { Spinner } from "@/components/spinner";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    setIsPending(true);
    const error = await logout();
    setIsPending(false);

    if (error) toast.error(error);

    router.refresh();
    window.location.href = "/login";
  }

  return (
    <Button variant="ghost" onClick={handleLogout} disabled={isPending} className="w-14">
      {isPending ? <Spinner /> : "Sair"}
    </Button>
  );
}
