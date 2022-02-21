import { Task, User } from "@prisma/client";
import moment from "moment";
import { useEffect, useState } from "react";
import { LinksFunction, LoaderFunction, Outlet, useLoaderData } from "remix";
import Backlog from "~/components/backlog";
import Calender from "~/components/calender";
import { prisma } from "~/lib/prisma";
import { ILoaderResponse } from "~/types";
import { useNavigate, useLocation } from "remix";
import queryString from "query-string";
import stylesCalenderUrl from "../styles/calender.css";
import stylesTasksUrl from "../styles/tasks.css";
import { requireUserId } from "~/utils/session.server";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import { ICON_COLOR } from "~/utils";

type Props = {};

export type PickedDay = { day: number; dateTime: string } | null;

export type ContextType = {
  pickedDay: PickedDay;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) throw new Error("missing user");

  let tasks = await prisma.task.findMany({
    where: {
      date: null,
      AND: {
        userId,
      },
    },
  });

  let tasksWithDateTimes = await prisma.task.findMany({
    where: {
      date: {
        gt: "1990-02-12T22:00:00.000Z",
      },
      AND: {
        userId,
      },
    },
    orderBy: {
      text: "asc",
    },
  });
  console.log("🤡 tasksWithDateTimes: ", tasksWithDateTimes);

  const dateTimes = tasksWithDateTimes.map((item) => item.date);
  await prisma.$disconnect();
  return { ok: true, data: { tasks, dateTimes, tasksWithDateTimes, user } };
};

const initialDay = {
  dateTime: moment().calendar("L"),
  day: moment().day(),
};

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: stylesTasksUrl },
    { rel: "stylesheet", href: stylesCalenderUrl },
  ];
};

export default function Tasks(props: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const [day, pickDay] = useState<PickedDay>(initialDay);

  const context: ContextType = { pickedDay: day };
  const outlet = <Outlet context={context} />;

  useEffect(() => {
    const parsed = queryString.parse(location.search);
    if (!parsed?.day) {
      navigate("/tasks/show/?day=" + encodeURIComponent(initialDay.dateTime));
    }
  }, []);

  const res = useLoaderData<
    ILoaderResponse<{
      tasks: Task[];
      dateTimes: string[];
      tasksWithDateTimes: Task[];
      user: User;
    }>
  >();

  if (!res.ok) {
    <div>Something went wrong</div>;
  }

  function handlePickDay(day: number, dateTime: string) {
    pickDay({ day, dateTime });
  }

  return (
    <div className="container">
      <div className="name-wrapper">
        <h5 className="name">Hi, {res.data.user.username}</h5>{" "}
        <form action="/forms/logout/" method="post">
          <IconButton type="submit" aria-label="logout">
            <LogoutIcon style={{ color: ICON_COLOR }} />
          </IconButton>
        </form>
      </div>

      <div className="root">
        <div className="calender-wrapper">
          <Calender
            tasks={res.data.tasksWithDateTimes}
            pickDay={handlePickDay}
            pickedDay={day}
            dateTimes={res.data.dateTimes}
          />
        </div>
        <div className="tasks-wrapper">{outlet}</div>
        <div className="backlog-wrapper">
          <Backlog data={res.data.tasks} pickedDay={day} />
        </div>
      </div>
    </div>
  );
}
