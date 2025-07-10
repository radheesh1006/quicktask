import React, { useState, useEffect } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import './Dashboard.css';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  // ✅ Load tasks from localStorage on first render
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error('Failed to parse saved tasks', error);
        setTasks([]);
      }
    }
  }, []);

  // ✅ Check for overdue tasks every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const updatedTasks = tasks.map((task) => {
        if (task.status === 'Pending' && new Date(task.dueDate) < now) {
          return { ...task, status: 'Overdue' };
        }
        return task;
      });

      const isChanged = JSON.stringify(updatedTasks) !== JSON.stringify(tasks);
      if (isChanged) {
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      }
    }, 60000); // runs every 60 seconds

    return () => clearInterval(interval);
  }, [tasks]);

  // ✅ Create or update task + save manually
  const handleAddOrUpdate = (task) => {
    let updatedTasks;
    if (editingTask) {
      updatedTasks = tasks.map((t) =>
        t.id === editingTask.id ? { ...task, id: t.id, status: t.status } : t
      );
      setEditingTask(null);
    } else {
      const newTask = {
        ...task,
        id: Date.now(),
        status: 'Pending',
      };
      updatedTasks = [...tasks, newTask];
    }

    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  // ✅ Edit task
  const handleEdit = (task) => {
    setEditingTask(task);
  };

  // ✅ Delete task
  const handleDelete = (id) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    localStorage.setItem('tasks', JSON.stringify(updated));
  };

  // ✅ Mark task as completed
  const handleComplete = (id) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, status: 'Completed' } : t
    );
    setTasks(updated);
    localStorage.setItem('tasks', JSON.stringify(updated));
  };

  return (
    <div className="dashboard-container">
      <h1>📓 Task Management Dashboard</h1>
      <div className="dashboard-grid">
        <div className="section-box">
          <TaskForm onSubmit={handleAddOrUpdate} task={editingTask} />
        </div>
        <div className="section-box">
          <TaskList
            tasks={tasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onComplete={handleComplete}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
