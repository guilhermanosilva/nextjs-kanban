import { BlocksIcon } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex items-center justify-center h-dvh xl:justify-between">
      <div className="xl:flex xl:justify-center xl:w-1/2">{children}</div>

      <div className="w-1/2 h-full hidden bg-primary xl:flex items-center justify-center">
        <BlocksIcon size={145} className="-rotate-45 opacity-50 text-white" />
      </div>
    </section>
  );
}
