const Record = require('../models/Record');

exports.getRecords = async (req, res) => {
  const userId = req.user.id;
  const { page = 1, perPage = 10, search = '' } = req.query;
  const pageInt = parseInt(page);
  const perPageInt = parseInt(perPage);
  const skip = (pageInt - 1) * perPageInt;

  try {
    const query = {
      user_id: userId,
      deleted: false,
      ...(search && { $or: [
        { operation_id: { $regex: search, $options: 'i' } },
        { amount: { $regex: search, $options: 'i' } },
        { user_balance: { $regex: search, $options: 'i' } },
        { operation_response: { $regex: search, $options: 'i' } },
        { date: { $regex: search, $options: 'i' } }
      ]})
    };

    const records = await Record.find(query)
      .skip(skip)
      .limit(perPageInt);

    res.status(200).json({ records });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteRecord = async (req, res) => {
  const recordId = req.params.id;

  try {
    const record = await Record.findByIdAndUpdate(recordId, { deleted: true });
    if (!record) return res.status(404).json({ message: 'Record not found' });

    res.status(200).json({ message: 'Record deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
