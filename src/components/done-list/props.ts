import { IScheduleList } from "../../types";

export interface DoneListProps {
  doneList: IScheduleList[];
  onDoneCheckboxClick: (index: number) => void;
  doneTotalPrice: () => IScheduleList;
}
