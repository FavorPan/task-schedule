import { IScheduleList } from "../../types";

export interface ScheduleListProps {
  scheduleList: IScheduleList[];
  onCheckboxClick: (index: number) => void;
  scheduleTotalPrice: () => IScheduleList;
}
