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
app.use(express.json()); // For parsing JSON

// Routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');

app.use('/api/auth', authRoutes);   // ✅ Login/Register
app.use('/api/tasks', taskRoutes);  // ✅ Task operations

// Root check (optional)
app.get('/', (req, res) => {
  res.send('✅ Backend API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
