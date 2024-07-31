const mongoose = require('mongoose');

const operationSchema = new mongoose.Schema({
  type: { type: String, enum: ['addition', 'subtraction', 'multiplication', 'division', 'square_root', 'random_string'], required: true },
  cost: { type: Number, required: true }
});

module.exports = mongoose.model('Operation', operationSchema);