import React, { useState } from 'react';
import './TaskList.css';

function TaskList({ tasks, onEdit, onDelete, onComplete }) {
  const [filter, setFilter] = useState('All');

  const filteredTasks = tasks.filter(task => {
    const isOverdue = task.status === 'Pending' && new Date(task.dueDate) < new Date();
    const effectiveStatus = isOverdue ? 'Overdue' : task.status;
    return filter === 'All' ? true : effectiveStatus === filter;
  });

  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="task-list">
      <h2>📋 Your Tasks</h2>
      <div className="filter-box">
        <label>
          Filter by status:
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option>All</option>
            <option>Pending</option>
            <option>Completed</option>
            <option>Overdue</option>
          </select>
        </label>
      </div>

      {filteredTasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <table className="task-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map(task => {
              const isOverdue = task.status === 'Pending' && new Date(task.dueDate) < new Date();
              const displayStatus = isOverdue ? 'Overdue' : task.status;

              return (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>{task.priority}</td>
                  <td>{formatDateTime(task.dueDate)}</td>
                  <td>{displayStatus}</td>
                  <td>
                    <button onClick={() => onEdit(task)}>Edit</button>
                    <button onClick={() => onDelete(task._id)}>Delete</button>
                    {task.status !== 'Completed' && (
                      <button onClick={() => onComplete(task._id)}>
                        Mark Done
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TaskList;
