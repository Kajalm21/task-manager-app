import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [descInput, setDescInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/tasks');
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error('Fetch failed:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddOrUpdateTask = async () => {
    if (!taskInput || !descInput) return;

    const task = {
      name: taskInput,
      description: descInput,
    };

    if (editingTaskId) {
      // Update task
      await fetch(`/tasks/${editingTaskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      setEditingTaskId(null);
    } else {
      // Add new task
      await fetch('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, id: Date.now().toString() }),
      });
    }

    setTaskInput('');
    setDescInput('');
    fetchTasks();
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/tasks/${id}`, { method: 'DELETE' });
      fetchTasks();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleEdit = (task) => {
    setTaskInput(task.name);
    setDescInput(task.description);
    setEditingTaskId(task.id);
  };

  const filteredTasks = tasks.filter((task) =>
    task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-container">
      <h1>📝 Task Manager</h1>

      <input
        type="text"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      <div className="task-form">
        <input
          type="text"
          placeholder="Task name"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={descInput}
          onChange={(e) => setDescInput(e.target.value)}
        />
        <button onClick={handleAddOrUpdateTask}>
          {editingTaskId ? 'Update Task' : 'Add Task'}
        </button>
      </div>

      <div className="task-list">
        {filteredTasks.map((task) => (
          <div className="task-card" key={task.id}>
            <h3>{task.name}</h3>
            <p>{task.description}</p>
            <div className="task-actions">
              <button onClick={() => handleEdit(task)}>✏️ Edit</button>
              <button onClick={() => handleDelete(task.id)}>❌ Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
