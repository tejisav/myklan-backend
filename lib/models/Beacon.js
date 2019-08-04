const mongoose = require('mongoose');
const BeaconSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  title: String,
  latitude: String,
  longitude: String,
  radius: String,
  members: [String],
  onExit: Boolean,
  onEntry: Boolean
});
mongoose.model('Beacon', BeaconSchema);

module.exports = mongoose.model('Beacon');