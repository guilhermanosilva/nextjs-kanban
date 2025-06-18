import ErrorPage from "@/app/error/page";

import { getStagesAction } from "@/features/kanban/actions/stages";
import { getCardsAction } from "@/features/kanban/actions/cards";
import { KanbanBoard } from "@/features/kanban/components/kanban-board";

export default async function KanbanPage() {
  const { data, error } = await getStagesAction();
  const { data: cards } = await getCardsAction();

  if (error || !data || !cards) {
    return <ErrorPage />;
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <KanbanBoard stages={data} cards={cards} />
    </div>
  );
}
