import { Card } from '@prisma/client'

import { DialogWrapper } from '@/components/dialog-wrapper'
import { FormAddCard } from '@/features/kanban/components/form-add-card'

type DialogAddCardProps = {
  initialData: Partial<Card> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

export function DialogAddCard({ initialData, open, onOpenChange, onSuccess }: DialogAddCardProps) {
  return (
    <DialogWrapper
      title="Adicionar tarefa"
      description="Insira os dados da tarefa"
      open={open}
      onOpenChange={onOpenChange}
    >
      <FormAddCard initialData={initialData} onSuccess={onSuccess} />
    </DialogWrapper>
  )
}
