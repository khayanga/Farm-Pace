import { startOfMonth, endOfMonth, startOfWeek, addDays } from "date-fns";
import DayCell from "./DayCell";

export default function CalendarGrid({ tasks, onDateClick, onTaskClick }) {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(monthStart);

  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridDays = 42; 

  return (
    <div className="grid grid-cols-7 border rounded-lg overflow-hidden">
      {Array.from({ length: gridDays }).map((_, i) => {
        const day = addDays(gridStart, i);

        const dayTasks = tasks.filter((t) => {
          if (!t || !t.startDate) return false;
          return new Date(t.startDate).toDateString() === day.toDateString();
        });

        return (
          <DayCell
            key={i}
            day={day}
            tasks={dayTasks}
            onDateClick={() => onDateClick(day)}
            onTaskClick={onTaskClick}
          />
        );
      })}
    </div>
  );
}
