const mongoose = require('mongoose');
const MemberSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  name: String,
  avatar: String,
  deviceToken: String,
  latitude: String,
  longitude: String,
  lastLocationUpdate: String
});
mongoose.model('Member', MemberSchema);

module.exports = mongoose.model('Member');