import { ActionFunction, redirect } from "remix";
import { prisma } from "~/lib/prisma";
import { getUserId, requireUserId } from "~/utils/session.server";

type Props = {};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  let formData = await request.formData();
  console.log("☞ formData TASKS: update", formData);

  let action = formData.get("_action");
  let id = formData.get("id")?.toString();
  let text = formData.get("text")?.toString();
  let done = formData.get("done")?.toString();

  if (!id) return { ok: false, data: null };

  switch (action) {
    case "update-text": {
      const updatedTask = await prisma.task.updateMany({
        where: {
          id,
          AND: {
            userId,
          },
        },
        data: {
          text,
        },
      });
      return { ok: true, data: updatedTask };
    }
    case "update-done": {
      const updatedTask = await prisma.task.updateMany({
        where: {
          id,
          AND: {
            userId,
          },
        },
        data: {
          done: !(done === "done"),
        },
      });

      return { ok: true, data: updatedTask };
    }
    default: {
      return { ok: false, data: null };
    }
  }
};

export default function Update(props: Props) {
  return <div>Update </div>;
}
