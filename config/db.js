import mongoose from "mongoose";
import { DATABASE_URL } from "./environment.js";

const connectDB = async () => {
  try {
    await mongoose
      .connect(DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((res) => {
        console.log("MongoDB Database Connection Success!");
      });
  } catch (err) {
    console.log("MongoDB Database Connection Failed!", err.message);
  }
};

export default connectDB;
