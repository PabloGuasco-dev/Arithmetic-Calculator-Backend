const axios = require('axios');
const Operation = require('../models/Operation');
const Record = require('../models/Record');
const User = require('../models/User');


exports.performOperation = async (req, res) => {
  console.log('performOperation called');
  const { type, amount1, amount2 } = req.body;

  try {
    if (!req.user) {
      console.error('No user in request');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = req.user.id;
    console.log("USER: " + userId);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found :' + userId });
    }

    const operation = await Operation.findOne({ type });
    if (!operation) {
      return res.status(404).json({ error: 'Operation not found' });
    }

    const cost = operation.cost;
    if (user.balance < cost) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    let result;
    switch (type) {
      case 'addition':
        result = amount1 + amount2;
        break;
      case 'subtraction':
        result = amount1 - amount2;
        break;
      case 'multiplication':
        result = amount1 * amount2;
        break;
      case 'division':
        if (amount2 === 0) {
          return res.status(400).json({ error: 'Division by zero' });
        }
        result = amount1 / amount2;
        break;
      case 'square_root':
        if (amount1 < 0) {
          return res.status(400).json({ error: 'Cannot calculate square root of a negative number' });
        }
        result = Math.sqrt(amount1);
        break;
      case 'random_string':
        try {
          const response = await axios.get('https://www.random.org/strings/?num=1&len=10&digits=on&upperalpha=on&loweralpha=on&unique=on&format=plain&rnd=new');
          result = response.data;
        } catch (error) {
          return res.status(500).json({ error: 'Failed to fetch random string' });
        }
        break;
      default:
        return res.status(400).json({ error: 'Invalid operation type' });
    }

    user.balance -= cost;
    await user.save();

    const record = new Record({
      operation_id: operation._id,
      user_id: user._id,
      amount: result,
      user_balance: user.balance,
      operation_response: result.toString(),
      date: new Date()
    });
    await record.save();

    res.status(201).json(record);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
