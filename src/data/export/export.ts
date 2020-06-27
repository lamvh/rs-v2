import { exportJSONCalendar } from "./calendar";
import { exportJSONReview } from "./review";

export const exportJSON = async () => {
  exportJSONCalendar();
  exportJSONReview();
};
