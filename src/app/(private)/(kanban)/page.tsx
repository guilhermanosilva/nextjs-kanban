import ErrorPage from '@/app/error/page'

import { getStagesAction } from '@/features/kanban/actions/stages'
import { getCardsAction } from '@/features/kanban/actions/cards'
import { KanbanBoard } from '@/features/kanban/components/kanban-board'
import { ConfigurationMenu } from '@/features/configuration/components/menu'

export default async function KanbanPage() {
  const { data, error } = await getStagesAction()
  const { data: cards } = await getCardsAction()

  if (error || !data || !cards) {
    return <ErrorPage />
  }

  return (
    <>
      <header className="bg-background p-2.5 flex items-center justify-end shadown">
        <ConfigurationMenu />
      </header>
      <KanbanBoard stages={data} cards={cards} />
    </>
  )
}
