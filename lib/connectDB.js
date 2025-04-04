import mongoose from "mongoose";

export const connectToDatabase = async () => {
  try {
    if (mongoose.connection.readyState) {
      console.log("ALREADY CONNECTED TO THE DATABASE");
      return mongoose.connection; // ✅ Return the existing connection
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "CodeNest_UCOE",
    });

    console.log(`CONNECTED TO THE DATABASE: ${conn.connection.host}`);
    return conn.connection; // ✅ Return the new connection
  } catch (error) {
    console.log(`ERROR WHILE CONNECTING TO DATABASE: ${error}`);
    throw new Error("Error while connecting to database");
  }
};
