import React, { useState, useEffect } from 'react';
import './TaskForm.css';

function TaskForm({ onSubmit, task }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Low',
  });

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
      });
    }
  }, [task]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.dueDate) return;
    onSubmit(form);
    setForm({
      title: '',
      description: '',
      dueDate: '',
      priority: 'Low',
    });
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>📝 Create New Task</h2>

      <label>Task Title</label>
      <input type="text" name="title" value={form.title} onChange={handleChange} required />

      <label>Description</label>
      <textarea name="description" value={form.description} onChange={handleChange} required />

      <label>Due Date & Time</label>
      <input type="datetime-local" name="dueDate" value={form.dueDate} onChange={handleChange} required />

      <label>Priority</label>
      <select name="priority" value={form.priority} onChange={handleChange}>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm;
