// userSchema.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    isLoggedIn: { type: Boolean, default: false },
    createdOn: { type: String, default: new Date().toLocaleString() },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret.hashedPassword;
        return ret;
      },
    },
  }
);

// Hash the password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("hashedPassword")) {
    const salt = await bcrypt.genSalt(10);
    this.hashedPassword = await bcrypt.hash(this.hashedPassword, salt);
  }
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
