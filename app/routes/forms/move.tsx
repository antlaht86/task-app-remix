import { ActionFunction } from "remix";
import { prisma } from "~/lib/prisma";
import { getCustomDateTime } from "~/utils";
import { requireUserId } from "~/utils/session.server";

type Props = {};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  let formData = await request.formData();

  let action = formData.get("_action");
  let id = formData.get("id")?.toString();
  let dateTime = getCustomDateTime(formData.get("dateTime")?.toString());

  if (!id) return { ok: false, data: null };

  switch (action) {
    case "toCalender": {
      const updatedTask = await prisma.task.updateMany({
        where: {
          id,
          AND: {
            userId,
          },
        },
        data: {
          date: dateTime,
        },
      });

      return { ok: true, data: updatedTask };
    }
    case "toBacklog": {
      const updatedTask = await prisma.task.updateMany({
        where: {
          id,
          AND: {
            userId,
          },
        },
        data: {
          date: null,
        },
      });

      return { ok: true, data: updatedTask };
    }
    default: {
      return { ok: false, data: null };
    }
  }
};

export default function Move(props: Props) {
  return <div>Move </div>;
}
