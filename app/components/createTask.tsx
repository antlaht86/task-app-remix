import IconButton from "@mui/material/IconButton";
import { PickedDay } from "~/routes/tasks";
import AddIcon from "@mui/icons-material/Add";
import { useFetcher } from "remix";
import CircularProgress from "@mui/material/CircularProgress";
import { ObjectID } from "bson";
const ICON_COLOR = "hsl(277, 85%, 38%)";

type Props = {
  pickedDay?: PickedDay;
  where: "toCalender" | "toBacklog";
};

export default function CreateTask({ where, pickedDay }: Props) {
  const fetcher = useFetcher();

  const isLoading = fetcher.submission;

  return (
    <div style={{ marginLeft: "10px" }}>
      <fetcher.Form
        method="post"
        action="/forms/new/"
        style={{ marginTop: "5px" }}
      >
        <input
          type="hidden"
          name="dateTime"
          defaultValue={pickedDay?.dateTime ?? ""}
        />
        <input type="hidden" name="_action" defaultValue={"create"} />
        <input type="hidden" name="where" defaultValue={where} />
        <input type="hidden" name="id" defaultValue={new ObjectID().toJSON()} />

        <IconButton
          type="submit"
          name="_action"
          value={"move"}
          aria-label="move"
        >
          {isLoading ? (
            <CircularProgress style={{ color: ICON_COLOR }} size={20} />
          ) : (
            <AddIcon style={{ color: ICON_COLOR }} />
          )}
        </IconButton>
      </fetcher.Form>
    </div>
  );
}
