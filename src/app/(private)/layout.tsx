import { ThemeProvider } from "@/components/theme-provider";

import { ThemeButton } from "@/components/theme-button";
import { LogoutButton } from "@/features/auth/components/logout-button";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div>
        <header className="flex items-center w-full py-4 px-6 border-b bg-muted-foreground/5">
          <span className="text-xl font-bold">Kanban APP</span>
          <div className="ml-auto flex items-center gap-2">
            <ThemeButton />
            <LogoutButton />
          </div>
        </header>

        <main className="px-6">{children}</main>
      </div>
    </ThemeProvider>
  );
}
