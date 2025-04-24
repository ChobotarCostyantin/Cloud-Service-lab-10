const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Імя користувача є обов\'язковим'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email є обов\'язковим'],
    unique: true,
    lowercase: true,
    trim: true
  }
},
{
  timestamps: true
});

UserSchema.index({ name: 'text', email: 'text' });

const User = mongoose.model('User', UserSchema);

module.exports = User;
