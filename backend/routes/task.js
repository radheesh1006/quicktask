const router = require('express').Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');

// Create Task
router.post('/', auth, async (req, res) => {
  const task = await Task.create({ ...req.body, user: req.user.id });
  res.json(task);
});

// Get Tasks (with filters)
router.get('/', auth, async (req, res) => {
  const { status, priority } = req.query;
  const filter = { user: req.user.id };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  const tasks = await Task.find(filter);
  res.json(tasks);
});

// Update Task
router.put('/:id', auth, async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true }
  );
  res.json(task);
});

// Delete Task
router.delete('/:id', auth, async (req, res) => {
  await Task.deleteOne({ _id: req.params.id, user: req.user.id });
  res.json({ message: 'Deleted' });
});

module.exports = router;
