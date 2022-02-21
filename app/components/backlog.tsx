import { Task } from "@prisma/client";
import useMove from "~/hooks/useMove";
import { PickedDay } from "~/routes/tasks";
import CreateTask from "./createTask";
import TaskComponent from "./task";

type Props = {
  data: Task[];
  pickedDay: PickedDay;
};

export default function Backlog({ data, pickedDay }: Props) {
  const moveData = useMove({ ok: true, data }, "toBacklog");
  return (
    <div>
      <div className="header-wrapper">
        <h4 style={{ textAlign: "center" }}>Backlog</h4>
        <CreateTask where="toBacklog" />
      </div>

      <ul>
        {moveData.data &&
          moveData.data.map((item) => (
            <TaskComponent
              actionDeleteTask={`/forms/delete/`}
              actionMove={`/forms/move/`}
              actionUpdateTask={`/forms/update/`}
              data={item}
              hasInBacklog={true}
              key={item.id}
              pickedDay={pickedDay}
            />
          ))}
      </ul>
    </div>
  );
}
