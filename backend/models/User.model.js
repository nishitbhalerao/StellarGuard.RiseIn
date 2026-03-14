import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: Date,
  auditCount: {
    type: Number,
    default: 0
  }
});

export default mongoose.model('User', userSchema);
