import { useState } from "react";
import { Calendar, Grid3X3, List } from "lucide-react";
import CalendarGrid from "./CalendarGrid";
import WeekView from "./WeekView";
import DayView from "./DayView";
import { Card, CardContent } from "../ui/card";
import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";

export default function CalendarComponent({ tasks, onDateClick, onTaskClick }) {
  const [currentView, setCurrentView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (currentView === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (currentView === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (currentView === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (currentView === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getHeaderText = () => {
    if (currentView === "month") {
      return currentDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    } else if (currentView === "week") {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      return `${startOfWeek.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} - ${endOfWeek.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;
    } else {
      return currentDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  return (
    <Card className="rounded-lg border shadow-sm ">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold ">{getHeaderText()}</h2>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToday}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md"
            >
              Today
            </button>

            <div className="flex border border-gray-300 rounded-md">
              <button onClick={handlePrevious} className="px-3 py-1.5 ">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={handleNext} className="px-3 py-1.5  ">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex rounded-lg p-1 ">
          {/* MONTH */}
          <button
            onClick={() => setCurrentView("month")}
            className={`
      flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
      ${
        currentView === "month"
          ? "bg-teal-100 text-primary"
          : "text-muted-foreground hover:text-foreground"
      }
    `}
          >
            <Grid3X3 className="h-4 w-4" />
            Month
          </button>

          {/* WEEK */}
          <button
            onClick={() => setCurrentView("week")}
            className={`
      flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
      ${
        currentView === "week"
          ? "bg-teal-100 text-primary"
          : "text-muted-foreground hover:text-foreground"
      }
    `}
          >
            <Calendar className="h-4 w-4" />
            Week
          </button>

          {/* DAY */}
          <button
            onClick={() => setCurrentView("day")}
            className={`
      flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
      ${
        currentView === "day"
          ? "bg-teal-100 text-primary"
          : "text-muted-foreground hover:text-foreground"
      }
    `}
          >
            <List className="h-4 w-4" />
            Day
          </button>
        </div>
      </div>

      {/* Calendar Views */}
      <CardContent className="p-6 ">
        {currentView === "month" && (
          <CalendarGrid
            currentDate={currentDate}
            tasks={tasks}
            onDateClick={onDateClick}
            onTaskClick={onTaskClick}
          />
        )}

        {currentView === "week" && (
          <WeekView
            currentDate={currentDate}
            tasks={tasks}
            onDateClick={onDateClick}
            onTaskClick={onTaskClick}
          />
        )}

        {currentView === "day" && (
          <DayView
            currentDate={currentDate}
            tasks={tasks}
            onDateClick={onDateClick}
            onTaskClick={onTaskClick}
          />
        )}
      </CardContent>
    </Card>
  );
}
