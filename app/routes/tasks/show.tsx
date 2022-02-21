import { Task } from "@prisma/client";
import {
  LinksFunction,
  LoaderFunction,
  Outlet,
  useLoaderData,
  useOutletContext,
} from "remix";
import CreateTask from "~/components/createTask";
import TaskComponent from "~/components/task";
import useMove from "~/hooks/useMove";
import { prisma } from "~/lib/prisma";
import { ILoaderResponse } from "~/types";
import { getCustomDateTime } from "~/utils";
import { requireUserId } from "~/utils/session.server";
import stylesTasksUrl from "../../styles/tasks.css";

import type { ContextType } from "../tasks";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  let url = new URL(request.url);

  let day = getCustomDateTime(url.searchParams.get("day")?.toString());
  let tasks: Task[] = [];

  if (day) {
    tasks = await prisma.task.findMany({
      where: {
        date: day,

        AND: {
          userId,
        },
      },
      orderBy: {
        text: "asc",
      },
    });
  } else {
    tasks = await prisma.task.findMany({
      where: {
        userId,
      },
    });
  }

  await prisma.$disconnect();
  return { ok: true, data: tasks };
};

type Props = {};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesTasksUrl }];
};

export default function Index(props: Props) {
  const res = useLoaderData<ILoaderResponse<Task[]>>();
  const { data } = useMove(res, "toCalender");
  const { pickedDay } = useOutletContext<ContextType>();

  if (!res.ok) {
    <div>Something went wrong</div>;
  }

  return (
    <div>
      <div className="header-wrapper">
        <h4 style={{ textAlign: "center" }}>Tasks</h4>
        <CreateTask where="toCalender" pickedDay={pickedDay} />
      </div>
      <ul>
        {data.map((item) => (
          <TaskComponent
            actionDeleteTask={`/forms/delete/`}
            actionMove={`/forms/move/`}
            actionUpdateTask={`/forms/update/`}
            data={item}
            disabled={item.userId == null}
            hasInBacklog={false}
            key={item.id + item.date}
            pickedDay={pickedDay}
          />
        ))}
        {data.length === 0 && (
          <div className="empty-list">
            <h5>No tasks</h5>
          </div>
        )}
      </ul>

      <Outlet />
    </div>
  );
}
