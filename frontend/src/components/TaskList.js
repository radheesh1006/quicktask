import React, { useState } from 'react';
import './TaskList.css';

function TaskList({ tasks, onEdit, onDelete, onComplete }) {
  const [filter, setFilter] = useState('All');

  const filteredTasks = tasks.filter(task =>
    filter === 'All' ? true : task.status === filter
  );

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
            {filteredTasks.map(task => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>{task.priority}</td>
                <td>
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleString()
                    : 'N/A'}
                </td>
                <td>{task.status}</td>
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
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TaskList;
