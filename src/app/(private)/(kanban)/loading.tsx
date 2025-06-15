import { Spinner } from "@/components/spinner";

export default function Loading() {
  return (
    <main className="flex flex-col gap-3 h-dvh items-center justify-center">
      <Spinner />
      <p className="text-gray-700">Carregando...</p>
    </main>
  );
}
