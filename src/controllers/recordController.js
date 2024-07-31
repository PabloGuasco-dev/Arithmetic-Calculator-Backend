const Record = require('../models/Record');

exports.getRecords = async (req, res) => {
  const userId = req.user.id;
  const { page = 1, perPage = 10, search = '' } = req.query;
  const pageInt = parseInt(page);
  const perPageInt = parseInt(perPage);
  const skip = (pageInt - 1) * perPageInt;

  try {
    let query = {
      user_id: userId,
      deleted: false,
    };

    if (search) {
      query = {
        ...query,
        $or: [
          { amount: { $regex: search, $options: 'i' } },
          { user_balance: { $regex: search, $options: 'i' } },
          { operation_response: { $regex: search, $options: 'i' } },
          { date: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const records = await Record.find(query)
      .populate('operation_id', 'type') // Populate the operation_id with only the type field
      .skip(skip)
      .limit(perPageInt);

    res.status(200).json({ records });
  } catch (error) {
    console.error('Error fetching records:', error);
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
    console.error('Error deleting record:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
