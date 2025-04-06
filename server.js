// import { server } from "./app.js";
// import { connectToDatabase } from "./lib/connectDB.js";

// // Connect to MongoDB
// connectToDatabase();

// // Start the server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`Server is running on port: ${PORT}`);
// });

/**
 * CodeNest - Live Collaboration Server
 * Server initialization file that connects to the database and starts the HTTP server
 */

import { app, server } from "./app.js";
import { connectToDatabase } from "./lib/connectDB.js";

/**
 * Start the server
 * Connects to the database and starts the HTTP server
 */
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

//Start the server
startServer();
