import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  isLoggedIn: { type: Boolean, default: false },
  createdOn: { type: String, default: new Date().toLocaleString() },
});

// middleware to hash password
userSchema.pre('save', async function (next) {
  if (this.isModified('hashedPassword')) { 
      this.hashedPassword = await bcrypt.hash(this.hashedPassword, 10);
  }
  next(); 
});

// Method to compare password
userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.hashedPassword); 
};


const User = mongoose.model("User", userSchema);
export default User;
