import { format, isToday, startOfDay, addHours } from "date-fns";

export default function DayView({ currentDate, tasks, onDateClick, onTaskClick }) {
  const dayStart = startOfDay(currentDate);
  const hours = Array.from({ length: 12 }, (_, i) => addHours(dayStart, i + 8));

  const dayTasks = tasks.filter((t) => {
    if (!t?.startDate) return false;
    return new Date(t.startDate).toDateString() === currentDate.toDateString();
  });

  return (
    <div className="space-y-6">
      {/* Day Header */}
      <div
        className="
          flex items-center justify-between 
          p-4 rounded-lg 
          bg-muted
        "
      >
        <div>
          <h3 className="text-2xl font-bold text-foreground">
            {format(currentDate, "EEEE, MMMM d, yyyy")}
          </h3>

          {isToday(currentDate) && (
            <span
              className="
                bg-accent text-accent-foreground 
                text-xs px-2 py-1 rounded-full 
                mt-1 inline-block
              "
            >
              Today
            </span>
          )}
        </div>

        <div className="text-right">
          <div className="text-lg font-semibold text-foreground">
            {dayTasks.length} tasks
          </div>
          <div className="text-sm text-muted-foreground">
            Scheduled for today
          </div>
        </div>
      </div>

      {/* Time Grid */}
      <div className="space-y-4">
        {hours.map((hour) => {
          const hourTasks = dayTasks.filter((task) => {
            const taskHour = new Date(task.startDate).getHours();
            return taskHour === hour.getHours();
          });

          return (
            <div key={hour.toString()} className="flex gap-4">
              {/* Time Label */}
              <div className="w-20 text-right">
                <div className="text-sm font-medium text-foreground">
                  {format(hour, "HH:mm")}
                </div>
              </div>

              {/* Time Slot */}
              <div
                className="
                  flex-1 min-h-20 border border-border 
                  rounded-lg p-4 cursor-pointer 
                  transition-colors 
                  bg-background 
                  hover:bg-accent hover:text-accent-foreground
                "
                onClick={() => onDateClick(hour)}
              >
                {hourTasks.length > 0 ? (
                  <div className="space-y-2">
                    {hourTasks.map((task, index) => (
                      <div
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          onTaskClick(task);
                        }}
                        className="
                          p-3 rounded-lg font-medium cursor-pointer 
                          transition-all hover:shadow-md text-white
                        "
                        style={{
                          backgroundColor: task.color || "#3b82f6",
                        }}
                      >
                        <div className="font-medium">{task.title}</div>

                        {task.description && (
                          <div className="text-sm opacity-75 mt-1">
                            {task.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground text-sm h-full flex items-center">
                    No tasks scheduled
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
