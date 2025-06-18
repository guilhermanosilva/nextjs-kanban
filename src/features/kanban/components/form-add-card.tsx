"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Card } from "@prisma/client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/spinner";

import { createCardFormSchema, CreateCardForm } from "@/features/kanban/schemas/create-card";
import { createCardAction, updateCardAction } from "@/features/kanban/actions/cards";

type FormCardProps = {
  onSuccess: VoidFunction;
  initialData: Partial<Card> | null;
};

export function FormAddCard({ onSuccess, initialData }: FormCardProps) {
  const [isPending, setIsPending] = useState(false);
  const form = useForm<CreateCardForm>({
    resolver: zodResolver(createCardFormSchema),
    defaultValues: { title: "", description: "", ...initialData },
  });

  async function handleSubmit(formData: CreateCardForm) {
    try {
      setIsPending(true);
      const { data, error } = initialData?.id
        ? await updateCardAction(initialData, formData)
        : await createCardAction(formData);

      if (!data || error) {
        toast.error(error || "Ocorreu um erro ao salvar os dados");
        return;
      }

      toast.success(`Tarefa "${data.title}" salva com sucesso.`);
      onSuccess();
      form.reset();
      setIsPending(false);
    } catch {
      toast.error("Erro inesperado ao salvar os dados. Tente novamente.");
      setIsPending(false);
    }
  }

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-4 space-y-4", isPending && "animate-pulse")}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título da tarefa</FormLabel>
              <FormControl>
                <Input placeholder="Título da tarefa" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="Descrição" {...field} value={field.value || ""} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-32 self-end" disabled={isPending}>
          {isPending ? <Spinner /> : "Salvar"}
        </Button>
      </form>
    </Form>
  );
}
