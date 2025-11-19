// 'use client'
// import { useEffect, useState } from "react";

// import AddTaskModal from "./AddTaskModal";
// import ViewTaskModal from "./ViewTaskModal";
// import EditTaskModal from "./EditTaskModal";
// import CalendarComponent from "./CalendarComponent.";

// const MainCalendar = () => {
//     const [tasks, setTasks] = useState([]);
//     const [selectedDate, setSelectedDate] = useState(null);
//     const [selectedTask, setSelectedTask] = useState(null);
//     const [viewTaskModal, setViewTaskModal] = useState(false);
//     const [editOpen, setEditOpen] = useState(false);
//     const [currentUser, setCurrentUser] = useState(null);

//     return (
//         <div className="p-2">
//             <h1 className="text-2xl text-primary font-bold">Farm Calendar</h1>
//             <p className="text-sm font-light tracking-wider mb-4">
//                 Manage and schedule your daily activities down below seamlessly
//             </p>

//             <CalendarComponent
//                 tasks={tasks}
//                 onDateClick={(date) => setSelectedDate(date)}
//                 onTaskClick={handleTaskClick}
//             />

//             <AddTaskModal
//                 date={selectedDate}
//                 onClose={() => setSelectedDate(null)}
//                 onAdded={(newTask) => setTasks([...tasks, newTask])}
//             />

//             <ViewTaskModal
//                 open={viewTaskModal}
//                 task={selectedTask}
//                 onClose={handleTaskClose}
//                 userRole={currentUser?.role}
//                 onEdit={() => setEditOpen(true)}
//                 onDelete={(id) => console.log("Delete task", id)}
//             />

//             <EditTaskModal
//                 task={selectedTask}
//                 open={editOpen}
//                 onClose={() => setEditOpen(false)}
//                 setTasks={setTasks}
//                 refresh={fetchTasks}
//             />
//         </div>
//     );
// }

// export default MainCalendar;

"use client";
import { useEffect, useState } from "react";

import AddTaskModal from "./AddTaskModal";
import ViewTaskModal from "./ViewTaskModal";
import EditTaskModal from "./EditTaskModal";
import CalendarComponent from "./CalendarComponent.";

const MainCalendar = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [viewTaskModal, setViewTaskModal] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/auth/user");
      if (!res.ok) return;

      const data = await res.json();
      setCurrentUser(data.user);
    }

    fetchUser();
  }, []);

  
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

  async function handleTaskDelete(id) {
  const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  if (!res.ok) {
    console.error("Failed to delete task");
    return;
  }
  setTasks((prev) => prev.filter((t) => t.id !== id));
  setSelectedTask(null);
  setViewTaskModal(false);
}
  if (!currentUser) {
    return (
      <div className="p-2">
        <p>Loading user...</p>
      </div>
    );
  }

  return (
    <div className="p-2">
      <h1 className="text-2xl text-primary font-bold">Farm Calendar</h1>
      <p className="text-sm font-light tracking-wider mb-4">
        Manage and schedule your daily activities down below seamlessly
      </p>

      <CalendarComponent
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
        userRole={currentUser?.role}
        onEdit={() => setEditOpen(true)}
        onDelete={handleTaskDelete}
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
};

export default MainCalendar;
