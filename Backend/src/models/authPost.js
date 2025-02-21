import mongoose from 'mongoose';

const authPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
  },
  userInt: {
    type: Number,
    required: true
  }
}, {
  timestamps: true  // This adds createdAt and updatedAt automatically
});

const AuthPost = mongoose.model('AuthPost', authPostSchema);

export default AuthPost;