import { format } from "date-fns";

export default function DayCell({
  day,
  tasks,
  isCurrentMonth,
  isToday,
  onDateClick,
  onTaskClick,
}) {
  const displayedTasks = tasks.slice(0, 3);
  const hasMoreTasks = tasks.length > 3;

  return (
    <div
      className={`
        min-h-[120px] p-2 relative cursor-pointer transition-colors 
        ${!isCurrentMonth 
          ? "bg-lime-100 text-muted-foreground dark:bg-lime-100/20 dark:text-muted-foreground" 
          : "bg-card dark:bg-card dark:hover:bg-accent"
        }
        ${isToday ? "bg-accent/50 dark:bg-accent/30" : ""}
      `}
      onClick={onDateClick}
    >
      
      <div className="flex items-center justify-between mb-1">
        <div
          className={`
            flex items-center justify-center h-7 w-7 text-sm font-medium rounded-full
            ${isToday
              ? "bg-primary/20 text-primary dark:bg-primary/30"
              : isCurrentMonth
              ? "text-foreground"
              : "text-muted-foreground"
            }
          `}
        >
          {format(day, "d")}
        </div>

        {tasks.length > 0 && (
          <span
            className="
              bg-primary/10 text-primary 
              dark:bg-primary/20 dark:text-primary 
              text-xs px-1.5 py-0.5 rounded-full
            "
          >
            {tasks.length}
          </span>
        )}
      </div>

      
      <div className="space-y-1">
        {displayedTasks.map((task) => (
          <div
            key={task.id}
            onClick={(e) => {
              e.stopPropagation();
              onTaskClick(task);
            }}
            className="
              text-xs p-1.5 rounded font-medium truncate 
              text-white shadow-sm 
              hover:opacity-90 transition-opacity
            "
            style={{
              backgroundColor: task.color || "#3b82f6",
            }}
          >
            {task.title}
          </div>
        ))}

        
        {hasMoreTasks && (
          <div className="text-xs text-muted-foreground text-center">
            +{tasks.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
}
