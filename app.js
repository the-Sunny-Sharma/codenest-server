import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import Chat from "./models/LiveChats.js";

// Routes
import chatRoutes from "./routes/chatRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import { verifyToken } from "./utils/auth.js";
import User from "./models/UserDetails.js";

// Load Environment variables
config({
  path: "./config/config.env",
});

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // allow requests from this origin
    methods: ["GET", "POST"],
    credentials: true, // Allow cookies
  },
});

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000"], // allow requests from this origin
    credentials: true, // Allow cookies
  })
);

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser());

// Routes
app.use("/api/chat", chatRoutes);
app.use("/api/test", testRoutes);

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Join a specific chat room based on course, section, and chapter
  socket.on("join-stream", async (data) => {
    const { courseId, sectionOrder, chapterId, token } = data;

    try {
      //Verify token
      // const decodedUser = verifyToken(token);

      // if (!decodedUser)
      //   return socket.emit("error", { message: "Invalid session token" });

      // console.log(decodedUser);
      // const user = {
      //   id: decodedUser.id,
      // };

      const userEmail = token.user.email;

      // Fetch user details from the database
      const userDetails = await User.findOne({ email: userEmail }).lean();

      if (!userDetails) {
        return socket.emit("error", { message: "User not found in database" });
      }

      // console.log("USERDETAILS", userDetails);

      // Create a user object with DB data
      const user = {
        userId: userDetails._id.toString(), // MongoDB ID
        email: userDetails.email,
        username: userDetails.name,
        avatarUrl: userDetails.avatarUrl,
        isTeacher:
          userDetails.role === "teacher" || userDetails.role === "admin",
      };

      // console.log("USER", user);

      // Store user data in socket for later use
      socket.data.user = user;

      console.log("SOCKETUSER", socket.data.user);

      // Join the room
      const roomId = `${courseId}:${sectionOrder}:${chapterId}`;
      socket.join(roomId);
      socket.data.roomId = roomId;
      socket.data.streamId = `${courseId}-${chapterId}`;

      console.log(
        `User ${user.username} (${user.userId}) joined room ${roomId}`
      );

      // Notify room about new user
      socket.to(roomId).emit("user-joined", {
        userId: user.userId,
        username: user.username,
        message: `${user.username} joined the chat`,
      });

      // Send last 50 messages from this room to the user
      try {
        const messages = await Chat.find({
          courseId,
          sectionOrder,
          chapterId,
        })
          .sort({ createdAt: -1 })
          .limit(50)
          .lean();

        // Add isTeacher flag to messages
        const messagesWithTeacherFlag = messages.map((msg) => ({
          ...msg,
          isTeacher:
            msg.email.includes("teacher") || msg.email.includes("admin"),
        }));

        socket.emit("chat-history", messagesWithTeacherFlag.reverse());
      } catch (error) {
        console.error("Error fetching chat history:", error);
        socket.emit("error", { message: "Failed to fetch chat history" });
      }
    } catch (error) {
      console.error("Error in join-stream:", error);
      socket.emit("error", { message: "Failed to join stream chat" });
    }
  });

  // Handle chat messages
  socket.on("send-message", async (data) => {
    try {
      const { message, videoTimestamp } = data;
      const { user, roomId, streamId } = socket.data;

      if (!user || !roomId) {
        socket.emit("error", { message: "Not authenticated or not in a room" });
        return;
      }

      // Create chat message in database
      const [courseId, sectionOrder, chapterId] = roomId.split(":");

      const newMessage = new Chat({
        courseId,
        sectionOrder,
        chapterId,
        userId: user.userId,
        streamId,
        email: user.email,
        username: user.username,
        avatarUrl: user.avatarUrl,
        message,
        videoTimestamp: videoTimestamp || 0,
      });

      await newMessage.save();

      // Broadcast message to room
      io.to(roomId).emit("new-message", {
        ...newMessage.toObject(),
        isTeacher: user.isTeacher,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    const { user, roomId } = socket.data || {};
    if (user && roomId) {
      console.log(`User ${user.username} (${user.userId}) left room ${roomId}`);
      socket.to(roomId).emit("user-left", {
        userId: user.userId,
        username: user.username,
        message: `${user.username} left the chat`,
      });
    }
    console.log("Client disconnected:", socket.id);
  });
});

// Error middleware
app.use(errorMiddleware);

// Export both app and server
export { app, server };
