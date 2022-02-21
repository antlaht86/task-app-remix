import { Task } from "@prisma/client";
import { useState } from "react";
import { useFetcher } from "remix";
import { PickedDay } from "~/routes/tasks";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CircleIcon from "@mui/icons-material/Circle";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import React from "react";
const ICON_COLOR = "hsl(277, 85%, 38%)";

type Props = {
  actionDeleteTask?: string;
  actionMove?: string;
  actionUpdateTask?: string;
  data: Task;
  disabled?: boolean;
  hasInBacklog: boolean;
  pickedDay: PickedDay;
};

export default function TaskComponent({
  actionDeleteTask = ".",
  actionMove = ".",
  actionUpdateTask = ".",
  data,
  disabled,
  hasInBacklog,
  pickedDay,
}: Props) {
  const [isHidden, setIsHidden] = useState(false);
  const fetcher = useFetcher();

  const inputRef = React.useRef<HTMLInputElement>(null);

  if (fetcher.submission && isHidden) {
    return null;
  }
  const isDone = Boolean(data.done);

  const isDoneSubmitting =
    (fetcher.state === "submitting" || fetcher.state === "loading") &&
    fetcher?.submission?.formData.getAll("_action")?.[0] === "update-done";
  fetcher.submission && fetcher.submission.action === "/forms/update/";

  const isTextSubmitting =
    (fetcher.state === "submitting" || fetcher.state === "loading") &&
    fetcher?.submission?.formData.getAll("_action")?.[0] === "update-text";
  fetcher.submission && fetcher.submission.action === "/forms/update/";

  const hiddenDone = (
    <input type={"hidden"} name="done" defaultValue={isDone ? "done" : "not"} />
  );

  const hiddenIdAndDateTime = (
    <>
      <input type={"hidden"} name="id" defaultValue={data.id} />
      <input
        type={"hidden"}
        name="dateTime"
        defaultValue={pickedDay?.dateTime}
      />
    </>
  );

  const hiddenInputs = (
    <>
      <input type={"hidden"} name="text" defaultValue={data.text} />
      {hiddenDone}
      {hiddenIdAndDateTime}
    </>
  );

  const moveForm = (
    <fetcher.Form
      method="post"
      onSubmit={() => setIsHidden(true)}
      action={actionMove}
    >
      {hiddenInputs}
      <input
        type={"hidden"}
        name="_action"
        defaultValue={hasInBacklog ? "toCalender" : "toBacklog"}
      />
      <IconButton
        disabled={disabled}
        type="submit"
        name="_action"
        value={"move"}
        aria-label="move"
      >
        {hasInBacklog ? (
          <ArrowBackIcon style={{ color: ICON_COLOR }} />
        ) : (
          <ArrowForwardIcon style={{ color: ICON_COLOR }} />
        )}
      </IconButton>
    </fetcher.Form>
  );

  function getIsDone(val: boolean) {
    if (isDoneSubmitting) {
      return !val;
    }
    return val;
  }

  function handleUpdateText() {
    const formData = new FormData();
    formData.append("id", data.id);
    formData.append("text", inputRef?.current?.value ?? data.text);
    formData.append("_action", "update-text");
    fetcher.submit(formData, {
      action: actionUpdateTask,
      method: "post",
    });
  }

  return (
    <li className="task-item-root">
      {hasInBacklog && <>{moveForm}</>}
      <fetcher.Form method="post" action={actionUpdateTask}>
        {hiddenIdAndDateTime}
        <input type={"hidden"} name="_action" defaultValue={"update-done"} />

        <input
          type={"hidden"}
          name="done"
          defaultValue={isDone ? "done" : "not"}
        />
        <IconButton
          disabled={isDoneSubmitting || disabled}
          type="submit"
          name="_action"
          value={"update-done"}
          aria-label="done"
        >
          {getIsDone(isDone) ? (
            <CheckCircleIcon
              style={{
                color: ICON_COLOR,
                opacity: isDoneSubmitting ? "0.7" : "unset",
              }}
            />
          ) : (
            <CircleIcon
              style={{
                color: ICON_COLOR,
                opacity: isDoneSubmitting ? "0.7" : "unset",
              }}
            />
          )}
        </IconButton>
      </fetcher.Form>
      <fetcher.Form method="post" action={actionUpdateTask}>
        <input
          disabled={isTextSubmitting || disabled}
          type={"text"}
          name="text"
          ref={inputRef}
          defaultValue={data.text}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleUpdateText();
            }
          }}
          onBlur={() => handleUpdateText()}
        />
      </fetcher.Form>
      <fetcher.Form
        method="post"
        action={actionDeleteTask}
        onSubmit={() => setIsHidden(true)}
      >
        {hiddenInputs}
        <input type={"hidden"} name="_action" defaultValue={"delete"} />
        <IconButton
          id="asd"
          type="submit"
          name="_action"
          value={"delete"}
          disabled={Boolean(fetcher.submission) || disabled}
          aria-label="delete"
        >
          <DeleteIcon style={{ color: "#f30505" }} />
        </IconButton>
      </fetcher.Form>

      {!hasInBacklog && <>{moveForm}</>}
    </li>
  );
}
