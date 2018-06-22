const mongoose = require('mongoose');

const Todo = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    required: true,
    default: false
  }
});

module.exports = mongoose.model('Todo', Todo);
