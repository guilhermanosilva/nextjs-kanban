"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { CreateStage, createStageSchema } from "@/features/kanban/schemas/create-stage";
import { Spinner } from "@/components/spinner";
import { createStageAction } from "@/features/kanban/actions/stages";

export function DialogAddColumn() {
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<CreateStage>({
    resolver: zodResolver(createStageSchema),
    defaultValues: { name: "" },
  });

  function handleSubmit(data: CreateStage) {
    try {
      startTransition(async () => {
        const formData = new FormData();
        formData.append("name", data.name);

        const response = await createStageAction(formData);

        if (response.error) {
          toast.error(response.error);
          return;
        }

        toast.success(`Coluna "${data.name}" criada com sucesso.`);
        setDialogOpen(false);
        form.reset();
      });
    } catch (error) {
      toast.error("Erro inesperado ao criar coluna. Tente novamente.");
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setDialogOpen(true)}>
          <PlusIcon /> Adicionar coluna
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova coluna</DialogTitle>
          <DialogDescription>Insira os dados da coluna</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4 flex flex-col gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da coluna</FormLabel>
                  <FormControl>
                    <Input placeholder="Em progresso" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending} className="self-end w-32">
              {isPending ? <Spinner /> : "Salvar"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
