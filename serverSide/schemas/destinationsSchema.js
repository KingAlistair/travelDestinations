// models/Destination.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const destinationSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  image: String,
  link: String,
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  countryCode: String,
});

const Destination = mongoose.model("Destination", destinationSchema);
export default Destination;
