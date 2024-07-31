const axios = require('axios');

exports.performOperationLogic = async (operationType, amount) => {
  switch (operationType) {
    case 'addition':
      return amount[0] + amount[1];
    case 'subtraction':
      return amount[0] - amount[1];
    case 'multiplication':
      return amount[0] * amount[1];
    case 'division':
      return amount[0] / amount[1];
    case 'square_root':
      return Math.sqrt(amount[0]);
    case 'random_string':
      try {
        const response = await axios.get('https://www.random.org/strings/?num=1&len=10&digits=on&upperalpha=on&loweralpha=on&unique=on&format=plain&rnd=new');
        return response.data.trim();
      } catch (error) {
        throw new Error('Failed to fetch random string');
      }
    default:
      throw new Error('Invalid operation type');
  }
};
