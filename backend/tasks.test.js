const request = require('supertest');
const app = require('../server'); // Adjust path as needed
const mongoose = require('mongoose');

let taskId;

describe('Task API Integration Tests', () => {
  // Optional: Connect and disconnect to a test DB
  beforeAll(async () => {
    // You can also use in-memory MongoDB if needed
    await mongoose.connect('mongodb://localhost:27017/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase(); // Clean test DB
    await mongoose.connection.close();
  });

  test('POST /tasks → should create a new task', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({
        title: 'Sample Task',
        description: 'Test description',
        dueDate: '2025-12-31T23:59:59.000Z',
        priority: 'High',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    taskId = res.body._id; // Save for later tests
  });

  test('GET /tasks → should return all tasks', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('PUT /tasks/:id → should update the task', async () => {
    const res = await request(app)
      .put(`/tasks/${taskId}`)
      .send({
        title: 'Updated Task',
        description: 'Updated description',
        priority: 'Medium',
        status: 'Completed',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated Task');
  });

  test('DELETE /tasks/:id → should delete the task', async () => {
    const res = await request(app).delete(`/tasks/${taskId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});

