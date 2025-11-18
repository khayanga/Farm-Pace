import { startOfWeek, addDays, format, isToday, isSameDay } from "date-fns";

export default function WeekView({ currentDate, tasks, onDateClick, onTaskClick }) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM – 7 PM

  return (
    <div className="space-y-4">
      {/* Week Header */}
      <div
        className="
          grid grid-cols-8 gap-px 
          bg-border rounded-lg overflow-hidden
        "
      >
        {/* Time Column Header */}
        <div
          className="
            bg-muted 
            p-3 text-center text-sm 
            font-medium text-muted-foreground
          "
        >
          Time
        </div>

        {weekDays.map((day) => {
          const today = isToday(day);

          return (
            <div
              key={day.toString()}
              className={`
                bg-muted p-3 text-center cursor-pointer 
                transition-colors hover:bg-accent 
                hover:text-accent-foreground
                ${today ? "bg-accent text-accent-foreground" : ""}
              `}
              onClick={() => onDateClick(day)}
            >
              <div className="text-sm font-medium">
                {format(day, "EEE")}
              </div>

              <div
                className={`text-lg font-bold ${
                  today ? "text-accent-foreground" : "text-foreground"
                }`}
              >
                {format(day, "d")}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time Grid */}
      <div
        className="
          grid grid-cols-8 gap-px 
          bg-border rounded-lg overflow-hidden shadow-sm
        "
      >
        {/* Time Labels */}
        <div className="bg-background">
          {hours.map((hour) => (
            <div
              key={hour}
              className="
                h-16 border-b border-border 
                p-2 text-sm text-muted-foreground
              "
            >
              {hour}:00
            </div>
          ))}
        </div>

        {/* Day Columns */}
        {weekDays.map((day) => {
          const dayTasks = tasks.filter((t) => {
            if (!t?.startDate) return false;
            return isSameDay(new Date(t.startDate), day);
          });

          return (
            <div key={day.toString()} className="bg-background relative">
              {/* Grid cells */}
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="
                    h-16 border-b border-border 
                    cursor-pointer transition-colors hover:bg-accent
                  "
                  onClick={() => onDateClick(day)}
                />
              ))}

              {/* Tasks */}
              <div className="absolute inset-0 pointer-events-none">
                {dayTasks.map((task, index) => {
                  const taskHour = new Date(task.startDate).getHours();
                  const top = (taskHour - 8) * 64;

                  return (
                    <div
                      key={index}
                      className="
                        absolute left-1 right-1 mx-1 p-2 rounded 
                        text-xs pointer-events-auto cursor-pointer 
                        shadow-sm font-medium text-white
                      "
                      style={{
                        top: `${top}px`,
                        height: "48px",
                        backgroundColor: task.color || "#3b82f6",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTaskClick(task);
                      }}
                    >
                      <div className="truncate">{task.title}</div>
                      <div className="text-xs opacity-75">
                        {format(new Date(task.startDate), "HH:mm")}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
