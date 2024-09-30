import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  isLoggedIn: { type: Boolean, default: false },
  createdOn: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
export default User;
