const dotenv = require('dotenv');
dotenv.config({ path: '../../.env.test' });

const request = require('supertest');
const app = require('../../src/app');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Operation = require('../../src/models/Operation');
const User = require('../../src/models/User');
const Record = require('../../src/models/Record');

const MONGO_URI_TEST = process.env.MONGO_URI_TEST || 'mongodb+srv://admin:Pablo0807@cluster38556.yodrc7d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster38556';

jest.setTimeout(30000);

let token;
let userId;

beforeAll(async () => {
  process.env.JWT_SECRET = 'jwt_secret_key';
  await mongoose.connect(MONGO_URI_TEST);

  await User.deleteMany({});

  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await User.create({
    username: 'testuser',
    password: hashedPassword,
    balance: 100
  });

  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({
      username: 'testuser',
      password: 'password123'
    });

  console.log('Login Response:', loginResponse.body);

  userId = loginResponse.body.userId;

  if (!loginResponse.body.token) {
    throw new Error('Login failed, no token received');
  }

  token = loginResponse.body.token;
  console.log('Token:', token);
});

beforeEach(async () => {
  await Operation.deleteMany({});
  await Record.deleteMany({});
  await User.updateOne({ _id: userId }, { balance: 100 });

  await Operation.create([
    { type: 'addition', cost: 10 },
    { type: 'subtraction', cost: 5 },
    { type: 'multiplication', cost: 15 },
    { type: 'division', cost: 20 },
    { type: 'square_root', cost: 25 }
  ]);
});

describe('Operation API', () => {
  it('should perform addition operation', async () => {
    const res = await request(app)
      .post('/api/operations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'addition',
        amount1: 5,
        amount2: 3
      });

    console.log('Addition operation response:', res.body);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('operation_id');
    expect(res.body).toHaveProperty('user_id');
    expect(res.body).toHaveProperty('amount', 8);
    expect(res.body).toHaveProperty('user_balance');
  }, 60000); // Incrementa el timeout a 60 segundos

  it('should return 404 if operation type does not exist', async () => {
    const res = await request(app)
      .post('/api/operations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'nonexistent_operation',
        amount1: 5,
        amount2: 3
      });

    console.log('Nonexistent operation response:', res.body);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error', 'Operation not found');
  });

  it('should return 400 if user has insufficient balance', async () => {
    await User.updateOne({ _id: userId }, { balance: 5 });

    const res = await request(app)
      .post('/api/operations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'addition',
        amount1: 5,
        amount2: 3
      });

    console.log('Insufficient balance response:', res.body);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'Insufficient balance');
  });

  it('should return 400 if division by zero is attempted', async () => {
    await User.updateOne({ _id: userId }, { balance: 100 });

    const res = await request(app)
      .post('/api/operations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'division',
        amount1: 5,
        amount2: 0
      });

    console.log('Division by zero response:', res.body);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'Division by zero');
  });

  it('should return 400 if square root of negative number is attempted', async () => {
    await User.updateOne({ _id: userId }, { balance: 100 });

    const res = await request(app)
      .post('/api/operations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'square_root',
        amount1: -1
      });

    console.log('Square root of negative number response:', res.body);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'Cannot calculate square root of a negative number');
  });

  it('should create a record for the operation', async () => {
    const res = await request(app)
      .post('/api/operations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'addition',
        amount1: 10,
        amount2: 5
      });

    console.log('Create record response:', res.body);

    expect(res.statusCode).toEqual(201);
    const record = await Record.findOne({ operation_id: res.body.operation_id });
    expect(record).toBeDefined();
    expect(record.amount).toBe(15);
  });
});
