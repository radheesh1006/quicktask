const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses JSON body

// Routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');

app.use('/api/auth', authRoutes);    // 🔐 Login/Register
app.use('/api/tasks', taskRoutes);  // 📋 Task APIs

// Health check
app.get('/', (req, res) => {
  res.send('✅ Backend API is running');
});

// Error handler middleware (Important for debugging)
app.use((err, req, res, next) => {
  console.error('🔥 Backend Error:', err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
module.exports = app;
