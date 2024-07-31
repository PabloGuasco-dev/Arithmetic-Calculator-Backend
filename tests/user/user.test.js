require('dotenv').config({ path: '.env.test' });

const request = require('supertest');
const app = require('../../src/app');
const mongoose = require('mongoose');
const User = require('../../src/models/User');


const MONGO_URI_TEST = process.env.MONGO_URI_TEST || 'mongodb+srv://admin:Pablo0807@cluster38556.yodrc7d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster38556';

jest.setTimeout(30000);

beforeAll(async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI_TEST, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
});

afterAll(async () => {
  try {
    if (mongoose.connection.db) {
      console.log('Dropping database...');
      await mongoose.connection.db.dropDatabase();
      console.log('Database dropped');
    }
    console.log('Closing MongoDB connection...');
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Failed to clean up', error);
  }
});

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        password: 'password123'
      });

    console.log('Register response:', res.body); // Añade esta línea para depurar la respuesta

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should not register a user with an existing username', async () => {
    await User.create({ username: 'existinguser', password: 'password123' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'existinguser',
        password: 'password123'
      });

    console.log('Duplicate user response:', res.body); // Añade esta línea para depurar la respuesta

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('msg', 'User already exists');
  });
});
