import React, { useState, useEffect } from 'react';
import './TaskForm.css';

function TaskForm({ onSubmit, task }) {
  const [form, setForm] = useState({
    userName: '',    // added
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    status: 'Pending'
  });

  useEffect(() => {
    if (task) {
      const iso = new Date(task.dueDate).toISOString().slice(0, 16);
      setForm({ ...task, dueDate: iso });
    }
  }, [task]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalForm = {
      ...form,
      dueDate: new Date(form.dueDate).toISOString()
    };

    onSubmit(finalForm);

    setForm({
      userName: '',
      title: '',
      description: '',
      dueDate: '',
      priority: 'Medium',
      status: 'Pending'
    });
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>{task ? '✏️ Edit Task' : '➕ Create New Task'}</h2>
      
      <input
        type="text"
        name="userName"
        placeholder="User Name"
        value={form.userName}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="title"
        placeholder="Task Title"
        value={form.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
      />
      <input
        type="datetime-local"
        name="dueDate"
        value={form.dueDate}
        onChange={handleChange}
        required
      />
      <select name="priority" value={form.priority} onChange={handleChange}>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
      <button type="submit">{task ? 'Update Task' : 'Add Task'}</button>
    </form>
  );
}

export default TaskForm;
