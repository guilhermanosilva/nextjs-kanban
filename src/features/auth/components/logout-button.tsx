"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { logout } from "@/features/auth/actions/auth-actions";
import { Loader2Icon } from "lucide-react";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      const error = await logout();

      if (error) toast.error(error);

      window.location.href = "/login";
    });
  };

  return (
    <Button variant="ghost" onClick={handleLogout} disabled={isPending} className="w-14">
      {isPending ? <Loader2Icon className="animate-spin" /> : "Sair"}
    </Button>
  );
}
