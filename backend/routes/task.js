const router = require('express').Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');

// 📌 Create Task
router.post('/', auth, async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, user: req.user.id });
    res.status(201).json(task);
  } catch (error) {
    console.error('❌ Error creating task:', error.message);
    res.status(500).json({ message: 'Failed to create task' });
  }
});

// 📌 Get Tasks with optional filters
router.get('/', auth, async (req, res) => {
  try {
    const { status, priority } = req.query;
    const filter = { user: req.user.id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter);
    res.status(200).json(tasks);
  } catch (error) {
    console.error('❌ Error fetching tasks:', error.message);
    res.status(500).json({ message: 'Failed to load tasks' });
  }
});

// 📌 Update Task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error('❌ Error updating task:', error.message);
    res.status(500).json({ message: 'Failed to update task' });
  }
});

// 📌 Delete Task
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await Task.deleteOne({ _id: req.params.id, user: req.user.id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted' });
  } catch (error) {
    console.error('❌ Error deleting task:', error.message);
    res.status(500).json({ message: 'Failed to delete task' });
  }
});

module.exports = router;
