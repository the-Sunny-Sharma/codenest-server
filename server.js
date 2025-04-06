// import { server } from "./app.js";
// import { connectToDatabase } from "./lib/connectDB.js";

// // Connect to MongoDB
// connectToDatabase();

// // Start the server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`Server is running on port: ${PORT}`);
// });
import { app, server } from "./app.js";
import { connectToDatabase } from "./lib/connectDB.js";

// Connect to MongoDB - only connect once here
async function startServer() {
  try {
    // Connect to database
    await connectToDatabase();

    // Start the server
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
