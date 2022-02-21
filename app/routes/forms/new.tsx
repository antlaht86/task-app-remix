import { ActionFunction, redirect } from "remix";
import { prisma } from "~/lib/prisma";
import { getCustomDateTime } from "~/utils";
import { uuid } from "uuidv4";
import { requireUserId } from "~/utils/session.server";

type Props = {};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  let formData = await request.formData();
  console.log("☞ formData TASKS Create: ", formData);

  let action = formData.get("_action")?.toString();
  let text = formData.get("text")?.toString() ?? "";
  let dateTime = getCustomDateTime(formData.get("dateTime")?.toString());

  switch (action) {
    case "create": {
      const createdTask = await prisma.task.create({
        data: {
          userId,
          slug: uuid(),
          text,
          date: dateTime,
        },
      });

      return { ok: true, data: null };
    }
    default: {
      return { ok: false, data: null };
    }
  }
};

export default function Create(props: Props) {
  return <div>Create</div>;
}
