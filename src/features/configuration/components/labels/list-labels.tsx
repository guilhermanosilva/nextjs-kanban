import { Label } from '@prisma/client'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { FormUpdateLabel } from '@/features/configuration/components/labels/form-update-label'

type ListLabelsProps = {
  data: Label[]
  onDelete: (id: string) => void
}

export function ListLabels({ data, onDelete }: ListLabelsProps) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <p className="text-center">Nenhum label cadastrada.</p>
        <p className="text-sm mt-2 italic text-muted-foreground">Clique no botão acima para adicionar uma.</p>
      </div>
    )
  }

  return (
    <ScrollArea className="overflow-auto pr-2.5">
      <div className="flex flex-col gap-2 max-h-80">
        {data.map((label) => (
          <FormUpdateLabel
            key={label.id}
            label={label}
            onDelete={onDelete}
          />
        ))}
      </div>
    </ScrollArea>
  )
}

export function ListLabelsSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-2 rounded-xl border mr-2">
          <Skeleton className="h-6 w-32" />
          <div className="flex items-center gap-2 ml-auto">
            <Skeleton className="size-6" />
            <Skeleton className="size-6" />
          </div>
        </div>
      ))}
    </div>
  )
}
