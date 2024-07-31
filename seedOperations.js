const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Operation = require('./src/models/Operation');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const operations = [
  { type: 'addition', cost: 1 },
  { type: 'subtraction', cost: 1 },
  { type: 'multiplication', cost: 2 },
  { type: 'division', cost: 2 },
  { type: 'square_root', cost: 3 },
  { type: 'random_string', cost: 5 }
];

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    
    await Operation.deleteMany({});
    await Operation.insertMany(operations);

    console.log('Operations seeded');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });
