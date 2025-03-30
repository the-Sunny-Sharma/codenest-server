import { server } from "./app.js";
import { connectToDatabase } from "./lib/connectDB.js";

// Connect to MongoDB
connectToDatabase();

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
