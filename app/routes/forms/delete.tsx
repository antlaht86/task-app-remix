import { ActionFunction, redirect } from "remix";
import { prisma } from "~/lib/prisma";
import { requireUserId } from "~/utils/session.server";

type Props = {};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  let formData = await request.formData();

  let action = formData.get("_action");
  let id = formData.get("id")?.toString();

  if (!id) return { ok: false, data: null };

  switch (action) {
    case "delete": {
      const deletedTask = await prisma.task.deleteMany({
        where: {
          id,
          AND: {
            userId,
          },
        },
      });

      return { ok: true, data: null };
    }
    default: {
      return { ok: false, data: null };
    }
  }
};

export default function Delete(props: Props) {
  return <div>Delete</div>;
}
