import { Task } from "@prisma/client";
import React, { useState } from "react";
import { useFetchers } from "remix";
import { ILoaderResponse } from "~/types";
import { ObjectID } from "bson";
export default function useMove(
  res: ILoaderResponse<Task[]>,
  where: "toBacklog" | "toCalender"
) {
  const [optimisticData, setOptimisticData] = useState<Task[]>([]);
  const [data, setData] = useState<Task[]>([]);
  const fetches = useFetchers();

  function addMore() {
    setData((state) =>
      state.concat([
        {
          done: false,
          slug: "new",
          id: "not",
          text: "",
          userId: "1",
          date: null,
        },
      ])
    );
  }

  React.useEffect(() => {
    if (fetches.length > 0) {
      for (const f of fetches) {
        if (
          f.state === "submitting" &&
          f.submission &&
          f.submission.formData?.getAll("_action")?.[0] === where
        ) {
          const formData = Object.fromEntries(
            f.submission.formData
          ) as unknown as Omit<Task, "done"> & { done: string };

          if (!optimisticData.find((item) => item.id === formData.id)) {
            setOptimisticData((state) =>
              state.concat([{ ...formData, done: formData.done === "done" }])
            );
          }
        } else if (
          f.state === "submitting" &&
          f.submission &&
          f.submission.formData?.getAll("where")?.[0] === where
        ) {
          const formData = Object.fromEntries(
            f.submission.formData
          ) as unknown as Omit<Task, "done"> & { done: string };

          if (!optimisticData.find((item) => item.id === formData.id)) {
            setOptimisticData((state) =>
              state.concat([
                {
                  ...formData,
                  done: formData.done === "done",
                  text: "",
                },
              ])
            );
          }
        }
      }
    }
  }, [fetches, setOptimisticData, optimisticData]);

  React.useEffect(() => {
    const renderData = res.data
      .concat(optimisticData)
      .sort((a, b) => a.text.localeCompare(b.text))
      .filter(
        (value, index, self) =>
          index ===
          self.findIndex((t) => t.text === value.text && t.id === value.id)
      );

    for (const o of optimisticData) {
      const databaseObject = renderData.find(
        (item) => item.id === o.id && item.userId != null
      );

      if (databaseObject)
        setOptimisticData((state) => state.filter((item) => item.id !== o.id));
    }

    setData(renderData);
  }, [setData, res.data, setOptimisticData, optimisticData]);

  return { data, addMore };
}
