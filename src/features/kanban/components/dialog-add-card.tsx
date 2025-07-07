import { CardWithLabels } from '@/features/kanban/schemas/get-card'

import { DialogWrapper } from '@/components/dialog-wrapper'
import { FormAddCard } from '@/features/kanban/components/form-add-card'

type DialogAddCardProps = {
  initialData: Partial<CardWithLabels> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

export function DialogAddCard({ initialData, open, onOpenChange, onSuccess }: DialogAddCardProps) {
  return (
    <DialogWrapper
      title={initialData?.id ? 'Editar tarefa' : 'Adicionar tarefa'}
      description={initialData?.id ? 'Ajuste os dados da tarefa' : 'Insira os dados da tarefa'}
      open={open}
      onOpenChange={onOpenChange}
    >
      <FormAddCard initialData={initialData} onSuccess={onSuccess} />
    </DialogWrapper>
  )
}
