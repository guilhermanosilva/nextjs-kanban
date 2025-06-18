"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/spinner";

import { CreateStage, createStageSchema } from "@/features/kanban/schemas/create-stage";
import { createStageAction } from "@/features/kanban/actions/stages";

export function FormAddColumn() {
  const [isPending, setIsPending] = useState(false);

  const form = useForm<CreateStage>({
    resolver: zodResolver(createStageSchema),
    defaultValues: { name: "" },
  });

  async function handleSubmit(data: CreateStage) {
    try {
      setIsPending(true);

      const formData = new FormData();
      formData.append("name", data.name);

      const { error } = await createStageAction(formData);
      setIsPending(false);

      if (error) {
        toast.error(error);
        return;
      }

      form.reset();
      toast.success(`Coluna "${data.name}" criada com sucesso.`);

    } catch (error) {
      toast.error("Erro inesperado ao criar coluna. Tente novamente.");
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da coluna</FormLabel>
              <FormControl>
                <Input placeholder="Em progresso" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-32 self-end">
          {isPending ? <Spinner /> : "Salvar"}
        </Button>
      </form>
    </Form>
  );
}
