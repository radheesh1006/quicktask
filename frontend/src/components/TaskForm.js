import React, { useState, useEffect } from 'react';

function TaskForm({ onSubmit, task }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDateTime: '',
    priority: 'Medium',
    status: 'Pending'
  });

  useEffect(() => {
    if (task) {
      // Format existing task datetime to local ISO format for input
      const localTime = new Date(task.dueDateTime);
      const offset = localTime.getTimezoneOffset();
      localTime.setMinutes(localTime.getMinutes() - offset); // Convert to local
      const iso = localTime.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
      setForm({ ...task, dueDateTime: iso });
    }
  }, [task]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const localTime = new Date(form.dueDateTime);
    const utcTime = new Date(localTime.getTime() - localTime.getTimezoneOffset() * 60000);
    const finalForm = { ...form, dueDateTime: utcTime.toISOString() };

    onSubmit(finalForm);
    setForm({
      title: '',
      description: '',
      dueDateTime: '',
      priority: 'Medium',
      status: 'Pending'
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{task ? '✏️ Edit Task' : '➕ Create New Task'}</h2>
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
        name="dueDateTime"
        value={form.dueDateTime}
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
