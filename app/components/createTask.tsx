import IconButton from "@mui/material/IconButton";
import { PickedDay } from "~/routes/tasks";
import AddIcon from "@mui/icons-material/Add";
import { useFetcher } from "remix";
const ICON_COLOR = "hsl(277, 85%, 38%)";

type Props = {
  pickedDay?: PickedDay;
};

export default function CreateTask({ pickedDay }: Props) {
  const fetcher = useFetcher();

  return (
    <div>
      <fetcher.Form method="post" action="/forms/new/">
        <input
          type="hidden"
          name="dateTime"
          defaultValue={pickedDay?.dateTime ?? ""}
        />
        <input type="hidden" name="_action" defaultValue={"create"} />
        <IconButton
          type="submit"
          name="_action"
          value={"move"}
          aria-label="move"
        >
          <AddIcon style={{ color: ICON_COLOR }} />
        </IconButton>
      </fetcher.Form>
    </div>
  );
}
