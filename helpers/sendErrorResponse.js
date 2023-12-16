
module.exports = class sendErrorResponse {

  static async fourTwoTwo(message, res) {
    res.status(422).json({ message });
  }

  static async twoZero(message, res) {
    res.status(200).json({ message });
  }
};



