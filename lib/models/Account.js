const mongoose = require('mongoose');
const AccountSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  name: String,
  username: String,
  password: String,
  info: String
});
mongoose.model('Account', AccountSchema);

module.exports = mongoose.model('Account');