import {
  startOfMonth,
  startOfWeek,
  addDays,
  isSameMonth,
  isToday,
} from "date-fns";
import DayCell from "./DayCell";

export default function CalendarGrid({
  currentDate,
  tasks,
  onDateClick,
  onTaskClick,
}) {
  const monthStart = startOfMonth(currentDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridDays = 42; // 6 weeks view

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="space-y-4">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-px rounded-lg overflow-hidden bg-border dark:bg-border">
        {weekdays.map((day) => (
          <div
            key={day}
            className="bg-muted dark:bg-muted/40 p-3 text-center text-sm font-medium text-muted-foreground dark:text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px rounded-lg overflow-hidden bg-border dark:bg-border shadow-sm">
        {Array.from({ length: gridDays }).map((_, i) => {
          const day = addDays(gridStart, i);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isTodayDate = isToday(day);

          // Filter tasks for this day
          const dayTasks = tasks.filter((t) => {
            if (!t?.startDate) return false;
            const taskDate = new Date(t.startDate);
            return (
              taskDate.getFullYear() === day.getFullYear() &&
              taskDate.getMonth() === day.getMonth() &&
              taskDate.getDate() === day.getDate()
            );
          });

          
          console.log(`Tasks for ${day.toDateString()}:`, dayTasks);

          return (
            <DayCell
              key={i}
              day={day}
              tasks={dayTasks}
              isCurrentMonth={isCurrentMonth}
              isToday={isTodayDate}
              onDateClick={() => onDateClick(day)}
              onTaskClick={onTaskClick}
            />
          );
        })}
      </div>
    </div>
  );
}
