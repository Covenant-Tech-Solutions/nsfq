import moment from "moment";
import { useCallback } from "react";

export function useTimeTaken() {
  const timeTaken = useCallback((time_taken: number) => {
    const duration = moment.duration(time_taken, "seconds");
    const hours = Math.floor(duration.asHours());
    const minutes = Math.floor(duration.minutes());
    const seconds = Math.floor(duration.seconds());
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  return timeTaken;
}
