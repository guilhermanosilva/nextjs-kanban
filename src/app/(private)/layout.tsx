import { ThemeProvider } from '@/components/theme-provider'

import { ThemeButton } from '@/components/theme-button'
import { LogoutButton } from '@/features/auth/components/logout-button'
import { ThemeToast } from '@/components/theme-toast'

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <div className="flex flex-col h-dvh">
        <header className="flex items-center w-full py-2 px-6 border-b bg-muted-foreground/5">
          <span className="text-xl font-bold">Kanban APP</span>
          <div className="ml-auto flex items-center gap-2">
            <ThemeButton />
            <LogoutButton />
          </div>
        </header>

        <main className="flex-1 flex flex-col bg-accent">{children}</main>
      </div>

      <ThemeToast />
    </ThemeProvider>
  )
}
