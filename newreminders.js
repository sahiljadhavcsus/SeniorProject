const mongoose = require("mongoose");

const NewReminder = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  bgcolor: {
    type: String,
  },
  time: {
    type: String,
  },
});

const NewReminders = mongoose.model("NewReminder", NewReminder);

module.exports = NewReminders;
