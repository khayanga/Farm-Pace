"use client";

import AddTaskModal from "@/components/calendar/AddTaskModal";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import EditTaskModal from "@/components/calendar/EditTaskModal";
import ViewTaskModal from "@/components/calendar/ViewTaskModal";
import { useEffect, useState } from "react";

export default function page() {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [viewTaskModal, setViewTaskModal] = useState(false);
   const [editOpen, setEditOpen] = useState(false);

   
  async function fetchTasks() {
  const res = await fetch("/api/tasks");
  const data = await res.json();
  setTasks(data);
}

useEffect(() => {
  fetchTasks();
}, []);


 useEffect(() => {
    if (selectedTask) {
      const updated = tasks.find((t) => t.id === selectedTask.id);
      if (updated) setSelectedTask(updated);
    }
  }, [tasks]);

  function handleTaskClick(task) {
    setSelectedTask(task);
    setViewTaskModal(true);
  }

  function handleTaskClose() {
    setSelectedTask(null);
    setViewTaskModal(false);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Farm Calendar</h1>

      <CalendarGrid
        tasks={tasks}
        onDateClick={(date) => setSelectedDate(date)}
        onTaskClick={handleTaskClick}
      />


      <AddTaskModal
        date={selectedDate}
        onClose={() => setSelectedDate(null)}
        onAdded={(newTask) => setTasks([...tasks, newTask])}
      />

      
      <ViewTaskModal
        open={viewTaskModal} 
        task={selectedTask}
        onClose={handleTaskClose}
        onEdit={() => setEditOpen(true)}
        onDelete={(id) => console.log("Delete task", id)}
        
      />
      <EditTaskModal
        task={selectedTask}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        setTasks={setTasks}
        refresh={fetchTasks}
      />
    </div>
  );
}
