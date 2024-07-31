const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  operation_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Operation', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: String, required: true },
  user_balance: { type: Number, required: true },
  operation_response: { type: String, required: true },
  date: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Record', recordSchema);