import ErrorPage from "@/app/error/page";

import { getStagesAction } from "@/features/kanban/actions/stages";
import { DialogAddColumn } from "@/features/kanban/components/dialog-add-column";
import { Columns } from "@/features/kanban/components/columns";

export default async function KanbanPage() {
  const { data, error } = await getStagesAction();

  if (error || !data) {
    return <ErrorPage />;
  }

  return (
    <>
      {data.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-6">
          <span className="">Para começar, adicione uma coluna.</span>
          <DialogAddColumn />
        </div>
      )}

      {data.length > 0 && (
        <div className="flex flex-1 flex-col gap-4">
          <div className="self-start">
            <DialogAddColumn />
          </div>

          <Columns stages={data} />
        </div>
      )}
    </>
  );
}
