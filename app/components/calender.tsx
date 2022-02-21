import { Task } from "@prisma/client";
import moment from "moment";
import { useNavigate } from "remix";
import useElementSize from "~/hooks/useElementSize";
import { cssc } from "~/utils";

type Props = {
  dateTimes: string[];
  pickDay: (arg: number, dateTime: string) => void;
  pickedDay: { day: number; dateTime: string } | null;
  tasks: Task[];
};

export default function Calender({
  dateTimes,
  pickDay,
  pickedDay,
  tasks,
}: Props) {
  const [calenderRef, { width }] = useElementSize();
  const today = moment();
  const navigate = useNavigate();
  const dates = getDays(width);

  return (
    <div className="calender-root" ref={calenderRef}>
      <div className="calender-list-root">
        <h3 style={{ marginBottom: "10px" }}> Calender</h3>
        <ul className="calender-list">
          {dates.map((item) => {
            if (!moment(item).isValid()) {
              return (
                <li key={item} className={" calender-month-item"}>
                  <div>{item}</div>
                </li>
              );
            }

            const dayOfYear = moment(item).dayOfYear();
            const whatISdayOfYearToday = moment().dayOfYear();

            const day = moment(item).date();

            const isTask = dateTimes.some(
              (dateTime) => moment(dateTime).calendar("L") === item
            );

            const hasWorkToDone = tasks.find(
              (task) =>
                moment(task.date).dayOfYear() === dayOfYear && !task.done
            );

            return (
              <li
                key={item}
                className={
                  cssc(
                    !!hasWorkToDone && dayOfYear < whatISdayOfYearToday,
                    "show-warning",
                    cssc(isTask, "task")
                  ) +
                  cssc(today.dayOfYear() === dayOfYear, "today") +
                  cssc(item === pickedDay?.dateTime, "selected-day") +
                  " calender-list-item"
                }
                onClick={() => {
                  pickDay(new Date(item).getTime(), item);
                  navigate(`/tasks/show/?day=${encodeURIComponent(item)}`);
                }}
              >
                <div>{day}</div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function getDays(width: number) {
  let count = -10;
  let dayAmount = 53;

  if (width < 450) {
    count = -5;
    dayAmount = 20;
  } else if (width < 600) {
    count = -7;
    dayAmount = 40;
  }
  let days = [];

  while (count < dayAmount) {
    if (count < 0) {
      const day = moment().subtract(count * -1, "days");

      if (
        day.startOf("month").calendar("L") ===
        moment()
          .subtract(count * -1, "days")
          .calendar("L")
      ) {
        days.push(
          moment()
            .subtract(count * -1, "days")
            .format("MMMM")
        );
      }

      days.push(
        moment()
          .subtract(count * -1, "days")
          .calendar("L")
      );
    } else if (count === 0) {
      const day = moment();

      if (
        day.startOf("month").calendar("L") ===
        moment()
          .subtract(count * -1, "days")
          .calendar("L")
      ) {
        days.push(moment().format("MMMM"));
      }
      days.push(moment().calendar("L"));
    } else {
      const day = moment().add(count, "days");

      if (
        day.startOf("month").calendar("L") ===
        moment().add(count, "days").calendar("L")
      ) {
        days.push(moment().add(count, "days").format("MMMM"));
      }
      days.push(moment().add(count, "days").calendar("L"));
    }
    count++;
  }
  return days;
}
