const request = require('supertest');
const app = require('./server');
const mongoose = require('mongoose');

let authToken;
let taskId;

jest.setTimeout(30000);  // Increase timeout to 30 seconds for slow operations

describe('Task API Integration Tests', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect('mongodb://localhost:27017/testdb', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    // Register a test user
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123'
      });

    // Login to get JWT token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123'
      });

    authToken = loginRes.body.token;
  });

  afterAll(async () => {
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.connection.close();
  });

  test('POST /tasks → should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Sample Task',
        description: 'Test description',
        dueDate: '2025-12-31T23:59:59.000Z',
        priority: 'High',
        userName: 'Test User'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    taskId = res.body._id;
  });

  test('GET /tasks → should return all tasks', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('PUT /tasks/:id → should update the task', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`)
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
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
