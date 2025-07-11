import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import './Dashboard.css';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  // ✅ Load tasks from backend
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
      alert('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ Add or update task
  const handleAddOrUpdate = async (task) => {
    try {
      if (editingTask) {
        await axios.put(`${API_BASE_URL}/tasks/${editingTask._id}`, task, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEditingTask(null);
      } else {
        await axios.post(`${API_BASE_URL}/tasks`, task, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchTasks(); // refresh after add/update
    } catch (err) {
      alert('Failed to save task');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  const handleComplete = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/tasks/${id}`, { status: 'Completed' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
    } catch (err) {
      alert('Failed to mark as completed');
    }
  };

  return (
    <div className="dashboard-container">
      <h1>📓 Task Management Dashboard</h1>

      <div className="dashboard-grid">
        <div className="section-box">
          <TaskForm onSubmit={handleAddOrUpdate} task={editingTask} />
        </div>
        <div className="section-box">
          {loading ? (
            <p>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p>No tasks available. Add one!</p>
          ) : (
            <TaskList
              tasks={tasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onComplete={handleComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
