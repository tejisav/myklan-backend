const mongoose = require('mongoose');
const ContactSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  name: String,
  number: String,
  info: String
});
mongoose.model('Contact', ContactSchema);

module.exports = mongoose.model('Contact');