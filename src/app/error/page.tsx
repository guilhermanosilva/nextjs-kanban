'use client'

import { BugIcon } from 'lucide-react'

export default function ErrorPage() {
  return (
    <div className="text-destructive flex h-full flex-col items-center justify-center gap-6">
      <BugIcon size={64} />
      <span className="text-xl">Ocorreu um erro inesperado</span>
    </div>
  )
}
