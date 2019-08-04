const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  title: String,
  description: String
});
mongoose.model('Task', TaskSchema);

module.exports = mongoose.model('Task');