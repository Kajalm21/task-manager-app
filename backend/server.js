/* eslint-disable no-undef */
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ✅ Basic root route to fix "Cannot GET /"
app.get('/', (req, res) => {
  res.send('API is working!');
});

// In-memory tasks array
let tasks = [];

// REST API Endpoints
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
  const task = req.body;
  tasks.push(task);
  res.status(201).json(task);
});

app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const index = tasks.findIndex((task) => task.id === id);
  if (index !== -1) {
    tasks[index] = req.body;
    res.json(tasks[index]);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});


app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;
  tasks = tasks.filter((task) => task.id !== id);
  res.status(200).json({ message: 'Task deleted' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
