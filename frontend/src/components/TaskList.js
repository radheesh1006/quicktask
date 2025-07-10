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
      <label>
        Filter by status:
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option>All</option>
          <option>Pending</option>
          <option>Completed</option>
          <option>Overdue</option>
        </select>
      </label>
      {filteredTasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Task</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map(task => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.priority}</td>
                <td>{new Date(task.dueDate).toLocaleString()}</td>
                <td>{task.status}</td>
                <td>
                  <button onClick={() => onEdit(task)}>Edit</button>
                  <button onClick={() => onDelete(task.id)}>Delete</button>
                  {task.status !== 'Completed' && (
                    <button onClick={() => onComplete(task.id)}>Mark Done</button>
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
