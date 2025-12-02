"use client";

import { useEffect, useState } from "react";

import AddTaskModal from "./AddTaskModal";
import ViewTaskModal from "./ViewTaskModal";
import EditTaskModal from "./EditTaskModal";
import CalendarComponent from "./CalendarComponent";

const MainCalendar = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [viewTaskModal, setViewTaskModal] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch current user
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/user");
        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setCurrentUser(data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    }

    fetchUser();
  }, []);

 useEffect(() => {
  async function fetchTasks() {
    if (!currentUser || !currentUser.farm?.id) return;

    try {
      const farmId = currentUser.farm.id;
      const now = new Date();
      const rangeStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      const rangeEnd = new Date(now.getFullYear(), now.getMonth() + 2, 0).toISOString();
      
      const res = await fetch(`/api/tasks?farmId=${farmId}&start=${rangeStart}&end=${rangeEnd}`);
      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("Tasks API did not return an array:", data);
        setTasks([]);
      } else {
        setTasks(data);
      }
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setTasks([]);
    }
  }

  fetchTasks();
}, [currentUser]);


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


async function handleTaskDelete(taskId) {
  try {
    let apiId = taskId;
    if (typeof taskId === "string" && taskId.startsWith("rec-")) {
      const parts = taskId.split("-");
      const recurringId = parts[1]; 
      apiId = `rec-${recurringId}`;
    }

    const res = await fetch(`/api/tasks/${apiId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to delete task: ${errText}`);
    }

  
    setTasks((prev) =>
      prev.filter((t) => {
        
        if (t.id === taskId) return false;

        
        if (t.taskId && t.taskId === taskId) return false;

        return true;
      })
    );

    setSelectedTask(null);
    setViewTaskModal(false);
  } catch (err) {
    console.error("Error deleting task:", err);
  }
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
        Manage and schedule your daily activities with ease.
      </p>

      <CalendarComponent
        tasks={Array.isArray(tasks) ? tasks : []} 
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
        refresh={() => {
          if (currentUser?.farmId) fetch(`/api/tasks?farmId=${currentUser.farmId}`)
            .then(res => res.json())
            .then(data => Array.isArray(data) ? setTasks(data) : setTasks([]))
            .catch(err => console.error(err));
        }}
      />
    </div>
  );
};

export default MainCalendar;