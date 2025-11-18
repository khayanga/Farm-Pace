
'use client'
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

export default MainCalendar;