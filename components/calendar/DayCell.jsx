import { format, isSameMonth, isToday } from "date-fns";

export default function DayCell({ day, tasks, onDateClick, onTaskClick }) {
  const isCurrentMonth = isSameMonth(day, new Date());

  return (
    <div
      className={`border p-2 h-32 relative cursor-pointer ${
        !isCurrentMonth ? "bg-gray-50 text-gray-400" : "bg-white"
      }`}
      onClick={onDateClick}
    >
      <div className="text-sm font-bold mb-1">
        {format(day, "d")}
        {isToday(day) && (
          <span className="ml-1 text-green-600 text-xs">(Today)</span>
        )}
      </div>

      {/* Tasks */}
      <div className="space-y-1">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={(e) => {
              e.stopPropagation(); 
              onTaskClick(task);
            }}
            className="text-xs p-1 rounded text-white"
            style={{ backgroundColor: task.color }}
          >
            {task.title}
          </div>
        ))}
      </div>
    </div>
  );
}
