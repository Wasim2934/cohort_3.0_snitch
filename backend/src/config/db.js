import mongoose from "mongoose";
import { config } from "./config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("Server is successfully connected to database");
  } catch (error) {
    console.log("Error while connecting to DB");
    process.exit(1);
  }
};

export default connectDB;
