// // import express from "express";
// // import { config } from "dotenv";
// // import cors from "cors";
// // import cookieParser from "cookie-parser";
// // import http from "http";
// // import { Server as SocketIOServer } from "socket.io";
// // import errorMiddleware from "./middlewares/errorMiddleware.js";
// // import Chat from "./models/LiveChats.js";

// // // Routes
// // import chatRoutes from "./routes/chatRoutes.js";
// // import testRoutes from "./routes/testRoutes.js";
// // import { verifyToken } from "./utils/auth.js";
// // import User from "./models/UserDetails.js";

// // // Load Environment variables
// // config({
// //   path: "./config/config.env",
// // });

// // // Initialize Express app
// // const app = express();
// // const server = http.createServer(app);

// // // Initialize Socket.IO
// // const io = new SocketIOServer(server, {
// //   cors: {
// //     origin: process.env.FRONTEND_URL || "http://localhost:3000", // allow requests from this origin
// //     methods: ["GET", "POST"],
// //     credentials: true, // Allow cookies
// //   },
// // });

// // // Middleware
// // app.use(
// //   cors({
// //     origin: [
// //       "http://localhost:3000",
// //       "https://noted-badly-lacewing.ngrok-free.app",
// //     ], // allow requests from this origin
// //     credentials: true, // Allow cookies
// //   })
// // );

// // app.use(express.json()); // Parse JSON bodies
// // app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
// // app.use(cookieParser());

// // // Routes
// // app.use("/api/chat", chatRoutes);
// // app.use("/api/test", testRoutes);

// // // Socket.IO connection handler
// // io.on("connection", (socket) => {
// //   console.log("New client connected:", socket.id);

// //   // Join a specific chat room based on course, section, and chapter
// //   socket.on("join-stream", async (data) => {
// //     const { courseId, sectionOrder, chapterId, token } = data;

// //     try {
// //       //Verify token
// //       // const decodedUser = verifyToken(token);

// //       // if (!decodedUser)
// //       //   return socket.emit("error", { message: "Invalid session token" });

// //       // console.log(decodedUser);
// //       // const user = {
// //       //   id: decodedUser.id,
// //       // };

// //       const userEmail = token.user.email;

// //       // Fetch user details from the database
// //       const userDetails = await User.findOne({ email: userEmail }).lean();

// //       if (!userDetails) {
// //         return socket.emit("error", { message: "User not found in database" });
// //       }

// //       // console.log("USERDETAILS", userDetails);

// //       // Create a user object with DB data
// //       const user = {
// //         userId: userDetails._id.toString(), // MongoDB ID
// //         email: userDetails.email,
// //         username: userDetails.name,
// //         avatarUrl: userDetails.avatarUrl,
// //         isTeacher:
// //           userDetails.role === "teacher" || userDetails.role === "admin",
// //       };

// //       // console.log("USER", user);

// //       // Store user data in socket for later use
// //       socket.data.user = user;

// //       console.log("SOCKETUSER", socket.data.user);

// //       // Join the room
// //       const roomId = `${courseId}:${sectionOrder}:${chapterId}`;
// //       socket.join(roomId);
// //       socket.data.roomId = roomId;
// //       socket.data.streamId = `${courseId}-${chapterId}`;

// //       console.log(
// //         `User ${user.username} (${user.userId}) joined room ${roomId}`
// //       );

// //       // Notify room about new user
// //       socket.to(roomId).emit("user-joined", {
// //         userId: user.userId,
// //         username: user.username,
// //         message: `${user.username} joined the chat`,
// //       });

// //       // Send last 50 messages from this room to the user
// //       try {
// //         const messages = await Chat.find({
// //           courseId,
// //           sectionOrder,
// //           chapterId,
// //         })
// //           .sort({ createdAt: -1 })
// //           .limit(50)
// //           .lean();

// //         // Add isTeacher flag to messages
// //         const messagesWithTeacherFlag = messages.map((msg) => ({
// //           ...msg,
// //           isTeacher:
// //             msg.email.includes("teacher") || msg.email.includes("admin"),
// //         }));

// //         socket.emit("chat-history", messagesWithTeacherFlag.reverse());
// //       } catch (error) {
// //         console.error("Error fetching chat history:", error);
// //         socket.emit("error", { message: "Failed to fetch chat history" });
// //       }
// //     } catch (error) {
// //       console.error("Error in join-stream:", error);
// //       socket.emit("error", { message: "Failed to join stream chat" });
// //     }
// //   });

// //   // Handle chat messages
// //   socket.on("send-message", async (data) => {
// //     try {
// //       const { message, videoTimestamp } = data;
// //       const { user, roomId, streamId } = socket.data;

// //       if (!user || !roomId) {
// //         socket.emit("error", { message: "Not authenticated or not in a room" });
// //         return;
// //       }

// //       // Create chat message in database
// //       const [courseId, sectionOrder, chapterId] = roomId.split(":");

// //       const newMessage = new Chat({
// //         courseId,
// //         sectionOrder,
// //         chapterId,
// //         userId: user.userId,
// //         streamId,
// //         email: user.email,
// //         username: user.username,
// //         avatarUrl: user.avatarUrl,
// //         message,
// //         videoTimestamp: videoTimestamp || 0,
// //       });

// //       await newMessage.save();

// //       // Broadcast message to room
// //       io.to(roomId).emit("new-message", {
// //         ...newMessage.toObject(),
// //         isTeacher: user.isTeacher,
// //       });
// //     } catch (error) {
// //       console.error("Error sending message:", error);
// //       socket.emit("error", { message: "Failed to send message" });
// //     }
// //   });

// //   // Handle disconnection
// //   socket.on("disconnect", () => {
// //     const { user, roomId } = socket.data || {};
// //     if (user && roomId) {
// //       console.log(`User ${user.username} (${user.userId}) left room ${roomId}`);
// //       socket.to(roomId).emit("user-left", {
// //         userId: user.userId,
// //         username: user.username,
// //         message: `${user.username} left the chat`,
// //       });
// //     }
// //     console.log("Client disconnected:", socket.id);
// //   });
// // });

// // // Error middleware
// // app.use(errorMiddleware);

// // // Export both app and server
// // export { app, server };

// import express from "express";
// import { createServer } from "http";
// import { Server } from "socket.io";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";

// // Load environment variables
// dotenv.config();

// // Initialize Express app
// const app = express();
// const server = createServer(app);

// // Configure CORS
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:3000",
//     methods: ["GET", "POST"],
//     credentials: true,
//   })
// );

// app.use(express.json());

// // Initialize Socket.IO
// const io = new Server(server, {
//   cors: {
//     origin: process.env.FRONTEND_URL || "http://localhost:3000",
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// // MongoDB connection
// mongoose
//   .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/codenest")
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // Define schemas
// const HelpRequestSchema = new mongoose.Schema({
//   courseId: { type: String, required: true },
//   chapterId: { type: String, required: true },
//   sectionOrder: { type: String, required: true },
//   studentId: { type: String, required: true },
//   studentName: { type: String, required: true },
//   studentEmail: { type: String, required: true },
//   studentAvatar: { type: String },
//   code: { type: String },
//   language: { type: String },
//   status: {
//     type: String,
//     enum: ["pending", "accepted", "rejected", "completed"],
//     default: "pending",
//   },
//   teacherId: { type: String },
//   teacherName: { type: String },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });

// const CodeSessionSchema = new mongoose.Schema({
//   courseId: { type: String, required: true },
//   chapterId: { type: String, required: true },
//   sectionOrder: { type: String, required: true },
//   code: { type: String, default: "// Write your code here" },
//   language: { type: String, default: "javascript" },
//   participants: [
//     {
//       userId: String,
//       name: String,
//       email: String,
//       avatar: String,
//       role: String,
//       socketId: String,
//     },
//   ],
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });

// // Create models
// const HelpRequest = mongoose.model("HelpRequest", HelpRequestSchema);
// const CodeSession = mongoose.model("CodeSession", CodeSessionSchema);

// // Track active rooms and participants
// const activeRooms = new Map();

// // Socket.IO connection handler
// io.on("connection", (socket) => {
//   console.log("New client connected:", socket.id);

//   // Extract user info from query parameters
//   const {
//     courseId,
//     chapterId,
//     sectionOrder,
//     userName,
//     userEmail,
//     userRole,
//     userAvatar,
//   } = socket.handshake.query;

//   // Store user data in socket
//   socket.data.user = {
//     name: userName,
//     email: userEmail,
//     role: userRole,
//     avatar: userAvatar,
//   };

//   // Join room handler
//   socket.on("joinRoom", async ({ room }) => {
//     try {
//       // Join the socket room
//       socket.join(room);
//       socket.data.roomId = room;

//       // Parse room ID to get course and chapter info
//       const [roomCourseId, roomChapterId] = room.split("_");

//       // Create participant object
//       const participant = {
//         userId: socket.id,
//         name: userName,
//         email: userEmail,
//         avatar: userAvatar,
//         role: userRole,
//         socketId: socket.id,
//       };

//       // Check if room exists in memory
//       if (!activeRooms.has(room)) {
//         // Check if session exists in database
//         let session = await CodeSession.findOne({
//           courseId: roomCourseId,
//           chapterId: roomChapterId,
//         });

//         if (!session) {
//           // Create new session
//           session = new CodeSession({
//             courseId: roomCourseId,
//             chapterId: roomChapterId,
//             sectionOrder,
//             participants: [participant],
//           });
//           await session.save();
//         } else {
//           // Update existing session with new participant
//           session.participants.push(participant);
//           session.updatedAt = new Date();
//           await session.save();
//         }

//         // Store session in memory
//         activeRooms.set(room, {
//           participants: [participant],
//           code: session.code,
//           language: session.language,
//         });
//       } else {
//         // Add participant to existing room
//         const roomData = activeRooms.get(room);
//         roomData.participants.push(participant);

//         // Update database
//         await CodeSession.updateOne(
//           { courseId: roomCourseId, chapterId: roomChapterId },
//           {
//             $push: { participants: participant },
//             $set: { updatedAt: new Date() },
//           }
//         );
//       }

//       // Get current room data
//       const roomData = activeRooms.get(room);

//       // Notify room about new participant
//       socket.to(room).emit("participantJoined", { participant });

//       // Send room data to the new participant
//       socket.emit("roomJoined", {
//         room,
//         participants: roomData.participants,
//         code: roomData.code,
//         language: roomData.language,
//       });

//       console.log(`User ${userName} joined room ${room}`);
//     } catch (error) {
//       console.error("Error joining room:", error);
//       socket.emit("error", { message: "Failed to join room" });
//     }
//   });

//   // Code update handler
//   socket.on("updateCode", async ({ roomId, code }) => {
//     try {
//       // Update code in memory
//       if (activeRooms.has(roomId)) {
//         activeRooms.get(roomId).code = code;
//       }

//       // Broadcast to room
//       socket.to(roomId).emit("codeUpdate", { code });

//       // Parse room ID
//       const [roomCourseId, roomChapterId] = roomId.split("_");

//       // Update in database (debounced)
//       clearTimeout(socket.data.codeUpdateTimeout);
//       socket.data.codeUpdateTimeout = setTimeout(async () => {
//         await CodeSession.updateOne(
//           { courseId: roomCourseId, chapterId: roomChapterId },
//           { $set: { code, updatedAt: new Date() } }
//         );
//       }, 2000); // Debounce for 2 seconds
//     } catch (error) {
//       console.error("Error updating code:", error);
//     }
//   });

//   // Language change handler
//   socket.on("languageChange", async ({ roomId, language }) => {
//     try {
//       // Update language in memory
//       if (activeRooms.has(roomId)) {
//         activeRooms.get(roomId).language = language;
//       }

//       // Broadcast to room
//       socket.to(roomId).emit("languageChange", { language });

//       // Parse room ID
//       const [roomCourseId, roomChapterId] = roomId.split("_");

//       // Update in database
//       await CodeSession.updateOne(
//         { courseId: roomCourseId, chapterId: roomChapterId },
//         { $set: { language, updatedAt: new Date() } }
//       );
//     } catch (error) {
//       console.error("Error changing language:", error);
//     }
//   });

//   // Code output handler
//   socket.on("codeOutput", ({ roomId, output }) => {
//     socket.to(roomId).emit("codeOutput", { output });
//   });

//   // Help request handler
//   socket.on(
//     "requestHelp",
//     async ({
//       roomId,
//       studentName,
//       studentEmail,
//       studentAvatar,
//       code,
//       language,
//     }) => {
//       try {
//         const [roomCourseId, roomChapterId] = roomId.split("_");

//         // Create help request in database
//         const helpRequest = new HelpRequest({
//           courseId: roomCourseId,
//           chapterId: roomChapterId,
//           sectionOrder,
//           studentId: socket.id,
//           studentName,
//           studentEmail,
//           studentAvatar,
//           code,
//           language,
//         });

//         await helpRequest.save();

//         // Find instructors in the room
//         const roomData = activeRooms.get(roomId);
//         if (roomData) {
//           const instructors = roomData.participants.filter(
//             (p) => p.role === "instructor"
//           );

//           // Notify instructors about help request
//           instructors.forEach((instructor) => {
//             io.to(instructor.socketId).emit("helpRequest", {
//               helpRequestId: helpRequest._id,
//               studentName,
//               studentEmail,
//               studentAvatar,
//               code,
//               language,
//               roomId,
//             });
//           });
//         }

//         // Notify student that request was sent
//         socket.emit("helpRequestSent", {
//           helpRequestId: helpRequest._id,
//           status: "pending",
//         });

//         console.log(`Help request created by ${studentName} in room ${roomId}`);
//       } catch (error) {
//         console.error("Error creating help request:", error);
//         socket.emit("error", { message: "Failed to create help request" });
//       }
//     }
//   );

//   // Help response handler
//   socket.on(
//     "helpResponse",
//     async ({ helpRequestId, studentSocketId, status }) => {
//       try {
//         // Update help request in database
//         const helpRequest = await HelpRequest.findById(helpRequestId);

//         if (!helpRequest) {
//           return socket.emit("error", { message: "Help request not found" });
//         }

//         helpRequest.status = status;
//         helpRequest.teacherId = socket.id;
//         helpRequest.teacherName = socket.data.user.name;
//         helpRequest.updatedAt = new Date();

//         await helpRequest.save();

//         // Notify student
//         io.to(studentSocketId).emit("helpRequestResponse", {
//           helpRequestId,
//           status,
//           teacherName: socket.data.user.name,
//         });

//         console.log(
//           `Help request ${helpRequestId} ${status} by ${socket.data.user.name}`
//         );
//       } catch (error) {
//         console.error("Error responding to help request:", error);
//         socket.emit("error", { message: "Failed to respond to help request" });
//       }
//     }
//   );

//   // Disconnect handler
//   socket.on("disconnect", async () => {
//     try {
//       const { roomId } = socket.data;

//       if (roomId && activeRooms.has(roomId)) {
//         const roomData = activeRooms.get(roomId);

//         // Remove participant from room
//         const participantIndex = roomData.participants.findIndex(
//           (p) => p.socketId === socket.id
//         );

//         if (participantIndex !== -1) {
//           const participant = roomData.participants[participantIndex];
//           roomData.participants.splice(participantIndex, 1);

//           // Notify room about participant leaving
//           socket.to(roomId).emit("participantLeft", {
//             participantId: socket.id,
//             participantName: participant.name,
//             participantRole: participant.role,
//           });

//           console.log(`User ${participant.name} left room ${roomId}`);

//           // Parse room ID
//           const [roomCourseId, roomChapterId] = roomId.split("_");

//           // Update database
//           await CodeSession.updateOne(
//             { courseId: roomCourseId, chapterId: roomChapterId },
//             {
//               $pull: { participants: { socketId: socket.id } },
//               $set: { updatedAt: new Date() },
//             }
//           );

//           // If room is empty, remove from memory
//           if (roomData.participants.length === 0) {
//             activeRooms.delete(roomId);
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error handling disconnect:", error);
//     }

//     console.log("Client disconnected:", socket.id);
//   });
// });

// // API routes
// app.get("/api/code-sessions/:courseId/:chapterId", async (req, res) => {
//   try {
//     const { courseId, chapterId } = req.params;

//     const session = await CodeSession.findOne({
//       courseId,
//       chapterId,
//     });

//     if (!session) {
//       return res.status(404).json({ message: "Session not found" });
//     }

//     res.json(session);
//   } catch (error) {
//     console.error("Error fetching code session:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// app.get("/api/help-requests/:courseId", async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const { status } = req.query;

//     const query = { courseId };
//     if (status) {
//       query.status = status;
//     }

//     const helpRequests = await HelpRequest.find(query).sort({ createdAt: -1 });

//     res.json(helpRequests);
//   } catch (error) {
//     console.error("Error fetching help requests:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Start server
// const PORT = process.env.PORT || 3001;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// export { app, server, io };

// ===============================================
/**
 * CodeNest - Live Collaboration Server
 * Main application file that sets up Express, Socket.IO, and defines all event
 */

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { config } from "dotenv";
import cors from "cors";
import helpRequestRoutes from "./routes/helpRequestRoutes.js";
import collaborationRoutes from "./routes/collaborationRoutes.js";

// Load environment variables
config({
  path: "./config/config.env",
});

// Initialize Express app
const app = express();
const server = createServer(app);

// Environment variables
const NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = NODE_ENV === "production";

// Configure CORS - middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Create a debug logger function that respects environment
const debug = (namespace, message, data = null) => {
  // if (!isProduction || process.env.DEBUG === "true") {
  //   const timestamp = new Date().toISOString();
  //   console.log(`[${timestamp}] [${namespace}] ${message}`);
  //   if (data) console.log(data);
  // }
  // if (!isProduction || process.env.DEBUG === "true") {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${namespace}] ${message}`);
  if (data) console.log(data);
  // }
};

// Import models
import HelpRequest from "./models/HelpRequest.js";
import CodeSession from "./models/CodeSession.js";
import Collaboration from "./models/Collaboration.js";

// Track active rooms, participants, and collaborations
const activeRooms = new Map();
const activeCollaborations = new Map(); // teacherId -> { studentId, roomId }
const studentCollaborations = new Map(); // studentId -> { teacherId, roomId }

// Socket.IO connection handler
io.on("connection", (socket) => {
  debug("socket", `New client connected: ${socket.id}`);

  // Extract user info from query parameters
  const {
    courseId,
    chapterId,
    sectionOrder,
    userName,
    userEmail,
    userRole,
    userAvatar,
  } = socket.handshake.query;

  // Store user data in socket
  socket.data.user = {
    name: userName,
    email: userEmail,
    role: userRole,
    avatar: userAvatar,
  };

  debug("socket:user", `User connected: ${userName} (${userRole})`, {
    email: userEmail,
    courseId,
    chapterId,
  });

  /**
   * Join room handler
   * Creates or joins a code editing room for a specific course and chapter
   */
  socket.on("joinRoom", async ({ room }) => {
    try {
      // Join the socket room
      socket.join(room);
      socket.data.roomId = room;

      debug("socket:room", `User ${userName} joining room ${room}`);

      // Parse room ID to get course and chapter info
      const [roomCourseId, roomChapterId] = room.split("_");

      // Create participant object
      const participant = {
        userId: socket.id,
        name: userName,
        email: userEmail,
        avatar: userAvatar,
        role: userRole,
        socketId: socket.id,
      };

      // Check if room exists in memory
      if (!activeRooms.has(room)) {
        debug("socket:room", `Creating new room in memory: ${room}`);

        // Check if session exists in database
        let session = await CodeSession.findOne({
          courseId: roomCourseId,
          chapterId: roomChapterId,
        });

        if (!session) {
          debug(
            "socket:room",
            `Creating new session in database for room: ${room}`
          );

          // Create new session
          session = new CodeSession({
            courseId: roomCourseId,
            chapterId: roomChapterId,
            sectionOrder,
            participants: [participant],
          });
          await session.save();
        } else {
          debug("socket:room", `Updating existing session for room: ${room}`);

          // Update existing session with new participant
          session.participants.push(participant);
          session.updatedAt = new Date();
          await session.save();
        }

        // Store session in memory
        activeRooms.set(room, {
          participants: [participant],
          code: session.code,
          language: session.language,
        });
      } else {
        debug("socket:room", `Adding participant to existing room: ${room}`);

        // Add participant to existing room
        const roomData = activeRooms.get(room);
        roomData.participants.push(participant);

        // Update database
        await CodeSession.updateOne(
          { courseId: roomCourseId, chapterId: roomChapterId },
          {
            $push: { participants: participant },
            $set: { updatedAt: new Date() },
          }
        );
      }

      // Get current room data
      const roomData = activeRooms.get(room);

      // Notify room about new participant
      socket.to(room).emit("participantJoined", { participant });

      // Send room data to the new participant
      socket.emit("roomJoined", {
        room,
        participants: roomData.participants,
        code: roomData.code,
        language: roomData.language,
      });

      debug("socket:room", `User ${userName} successfully joined room ${room}`);
    } catch (error) {
      console.error("Error joining room:", error);
      socket.emit("error", { message: "Failed to join room" });
    }
  });

  /**
   * Code update handler
   * Broadcasts code changes to all participants in the room
   */
  socket.on("updateCode", async ({ roomId, code }) => {
    try {
      // Update code in memory
      if (activeRooms.has(roomId)) {
        activeRooms.get(roomId).code = code;
      }

      // Broadcast to room
      socket.to(roomId).emit("codeUpdate", { code });

      // Parse room ID
      const [roomCourseId, roomChapterId] = roomId.split("_");

      // Update in database (debounced)
      clearTimeout(socket.data.codeUpdateTimeout);
      socket.data.codeUpdateTimeout = setTimeout(async () => {
        try {
          await CodeSession.updateOne(
            { courseId: roomCourseId, chapterId: roomChapterId },
            { $set: { code, updatedAt: new Date() } }
          );
          debug("socket:code", `Code updated in database for room: ${roomId}`);
        } catch (dbError) {
          console.error("Error updating code in database:", dbError);
        }
      }, 2000); // Debounce for 2 seconds
    } catch (error) {
      console.error("Error updating code:", error);
    }
  });

  /**
   * Language change handler
   * Updates the programming language for the code editor
   */
  socket.on("languageChange", async ({ roomId, language }) => {
    try {
      // Update language in memory
      if (activeRooms.has(roomId)) {
        activeRooms.get(roomId).language = language;
      }

      // Broadcast to room
      socket.to(roomId).emit("languageChange", { language });

      // Parse room ID
      const [roomCourseId, roomChapterId] = roomId.split("_");

      // Update in database
      await CodeSession.updateOne(
        { courseId: roomCourseId, chapterId: roomChapterId },
        { $set: { language, updatedAt: new Date() } }
      );

      debug(
        "socket:language",
        `Language changed to ${language} in room: ${roomId}`
      );
    } catch (error) {
      console.error("Error changing language:", error);
    }
  });

  /**
   * Code output handler
   * Shares code execution results with all participants
   */
  socket.on("codeOutput", ({ roomId, output }) => {
    socket.to(roomId).emit("codeOutput", { output });
    debug("socket:output", `Code output shared in room: ${roomId}`);
  });

  /**
   * Help request handler
   * Creates a help request when a student needs assistance
   */
  socket.on(
    "requestHelp",
    async ({
      roomId,
      studentName,
      studentEmail,
      studentAvatar,
      code,
      language,
      message,
    }) => {
      try {
        const [roomCourseId, roomChapterId] = roomId.split("_");

        // Check if student is already in a collaboration
        if (studentCollaborations.has(studentEmail)) {
          debug(
            "socket:help",
            `Help request rejected - student already in collaboration: ${studentEmail}`
          );
          return socket.emit("error", {
            message:
              "You are already in an active collaboration. Please end it before requesting new help.",
          });
        }

        debug("socket:help", `Help request received from ${studentName}`, {
          courseId: roomCourseId,
          chapterId: roomChapterId,
          message,
        });

        // Create help request in database
        const helpRequest = new HelpRequest({
          courseId: roomCourseId,
          chapterId: roomChapterId,
          sectionOrder,
          studentId: socket.id,
          studentName,
          studentEmail,
          studentAvatar,
          code,
          language,
          message,
          codeVersions: [
            {
              code,
              timestamp: new Date(),
              author: "student",
            },
          ],
        });

        await helpRequest.save();

        // Find instructors in the room
        const roomData = activeRooms.get(roomId);
        if (roomData) {
          const instructors = roomData.participants.filter(
            (p) => p.role === "instructor"
          );

          debug(
            "socket:help",
            `Notifying ${instructors.length} instructors about help request`
          );

          // Notify instructors about help request
          instructors.forEach((instructor) => {
            io.to(instructor.socketId).emit("helpRequest", {
              helpRequestId: helpRequest._id,
              studentName,
              studentEmail,
              studentAvatar,
              code,
              language,
              message,
              roomId,
              preview:
                code.substring(0, 100) + (code.length > 100 ? "..." : ""),
              timestamp: helpRequest.createdAt,
            });
          });
        }

        // Notify student that request was sent
        socket.emit("helpRequestSent", {
          helpRequestId: helpRequest._id,
          status: "pending",
        });

        debug(
          "socket:help",
          `Help request created by ${studentName} in room ${roomId}`
        );
      } catch (error) {
        console.error("Error creating help request:", error);
        socket.emit("error", { message: "Failed to create help request" });
      }
    }
  );

  /**
   * Help response handler
   * Handles instructor responses to help requests
   */
  socket.on(
    "helpResponse",
    async ({ helpRequestId, studentSocketId, studentEmail, status }) => {
      try {
        // Update help request in database
        const helpRequest = await HelpRequest.findById(helpRequestId);

        if (!helpRequest) {
          debug("socket:help", `Help request not found: ${helpRequestId}`);
          return socket.emit("error", { message: "Help request not found" });
        }

        // Check if teacher is already in a collaboration
        if (
          activeCollaborations.has(socket.data.user.email) &&
          status === "accepted"
        ) {
          // Get current collaboration
          const currentCollab = activeCollaborations.get(
            socket.data.user.email
          );

          debug(
            "socket:help",
            `Teacher ending existing collaboration to help new student`,
            {
              currentStudent: currentCollab.studentEmail,
              newStudent: studentEmail,
            }
          );

          // Notify current student that teacher is ending collaboration to help someone else
          io.to(currentCollab.studentSocketId).emit("collaborationEnded", {
            reason: "teacher_switched",
            message: `${socket.data.user.name} has ended this collaboration to help another student.`,
          });

          // End current collaboration in database
          await Collaboration.findByIdAndUpdate(currentCollab.collaborationId, {
            status: "terminated",
            endedAt: new Date(),
          });

          // Remove from active collaborations
          studentCollaborations.delete(currentCollab.studentEmail);
          activeCollaborations.delete(socket.data.user.email);

          debug(
            "socket:help",
            `Ended existing collaboration with ${currentCollab.studentEmail} to help ${studentEmail}`
          );
        }

        helpRequest.status = status;
        helpRequest.teacherId = socket.id;
        helpRequest.teacherName = socket.data.user.name;
        helpRequest.updatedAt = new Date();

        await helpRequest.save();

        // Notify student
        io.to(studentSocketId).emit("helpRequestResponse", {
          helpRequestId,
          status,
          teacherName: socket.data.user.name,
        });

        debug(
          "socket:help",
          `Help request ${helpRequestId} ${status} by ${socket.data.user.name}`
        );

        // If accepted, create a collaboration
        if (status === "accepted") {
          // Create collaboration room ID
          const collaborationRoomId = `collab_${helpRequestId}`;

          debug(
            "socket:collab",
            `Creating new collaboration between ${socket.data.user.name} and ${helpRequest.studentName}`
          );

          // Create collaboration in database
          const collaboration = new Collaboration({
            courseId: helpRequest.courseId,
            chapterId: helpRequest.chapterId,
            sectionOrder: helpRequest.sectionOrder,
            teacherId: socket.data.user.email,
            teacherName: socket.data.user.name,
            teacherEmail: socket.data.user.email,
            teacherSocketId: socket.id,
            studentId: helpRequest.studentId,
            studentName: helpRequest.studentName,
            studentEmail: helpRequest.studentEmail,
            studentSocketId: studentSocketId,
            helpRequestId: helpRequestId,
            codeVersions: [
              {
                code: helpRequest.code,
                language: helpRequest.language,
                timestamp: new Date(),
                author: "student",
              },
            ],
          });

          await collaboration.save();

          // Track active collaborations
          activeCollaborations.set(socket.data.user.email, {
            studentEmail: helpRequest.studentEmail,
            studentSocketId: studentSocketId,
            collaborationId: collaboration._id,
            roomId: collaborationRoomId,
          });

          studentCollaborations.set(helpRequest.studentEmail, {
            teacherEmail: socket.data.user.email,
            teacherSocketId: socket.id,
            collaborationId: collaboration._id,
            roomId: collaborationRoomId,
          });

          // Join both users to the collaboration room
          socket.join(collaborationRoomId);
          io.sockets.sockets.get(studentSocketId)?.join(collaborationRoomId);

          // Notify both users about the collaboration
          io.to(collaborationRoomId).emit("collaborationStarted", {
            collaborationId: collaboration._id,
            roomId: collaborationRoomId,
            teacher: {
              name: socket.data.user.name,
              email: socket.data.user.email,
              socketId: socket.id,
            },
            student: {
              name: helpRequest.studentName,
              email: helpRequest.studentEmail,
              socketId: studentSocketId,
            },
            initialCode: helpRequest.code,
            language: helpRequest.language,
          });

          debug(
            "socket:collab",
            `Collaboration started between ${socket.data.user.name} and ${helpRequest.studentName}`
          );
        }
      } catch (error) {
        console.error("Error responding to help request:", error);
        socket.emit("error", { message: "Failed to respond to help request" });
      }
    }
  );

  /**
   * End collaboration handler
   * Ends an active collaboration between student and teacher
   */
  socket.on("endCollaboration", async ({ collaborationId, reason }) => {
    try {
      const collaboration = await Collaboration.findById(collaborationId);

      if (!collaboration) {
        debug("socket:collab", `Collaboration not found: ${collaborationId}`);
        return socket.emit("error", { message: "Collaboration not found" });
      }

      // Check if user is part of this collaboration
      const isTeacher = collaboration.teacherEmail === socket.data.user.email;
      const isStudent = collaboration.studentEmail === socket.data.user.email;

      if (!isTeacher && !isStudent) {
        debug(
          "socket:collab",
          `User not part of collaboration: ${socket.data.user.email}`
        );
        return socket.emit("error", {
          message: "You are not part of this collaboration",
        });
      }

      // Update collaboration status
      collaboration.status = "ended";
      collaboration.endedAt = new Date();
      await collaboration.save();

      // Remove from active collaborations
      if (isTeacher) {
        activeCollaborations.delete(collaboration.teacherEmail);
        studentCollaborations.delete(collaboration.studentEmail);
      } else {
        activeCollaborations.delete(collaboration.teacherEmail);
        studentCollaborations.delete(collaboration.studentEmail);
      }

      // Notify both users
      const roomId = `collab_${collaboration._id}`;
      io.to(roomId).emit("collaborationEnded", {
        collaborationId,
        endedBy: isTeacher ? "teacher" : "student",
        reason: reason || "user_ended",
        message: `Collaboration ended by ${isTeacher ? "teacher" : "student"}`,
      });

      // Leave the room
      socket.leave(roomId);

      debug(
        "socket:collab",
        `Collaboration ${collaborationId} ended by ${
          isTeacher ? "teacher" : "student"
        }`
      );
    } catch (error) {
      console.error("Error ending collaboration:", error);
      socket.emit("error", { message: "Failed to end collaboration" });
    }
  });

  /**
   * Collaboration code update handler
   * Handles code updates during a collaboration session
   */
  socket.on(
    "collaborationCodeUpdate",
    async ({ collaborationId, code, language }) => {
      try {
        // Determine if user is teacher or student
        const isTeacher = activeCollaborations.has(socket.data.user.email);
        const isStudent = studentCollaborations.has(socket.data.user.email);

        if (!isTeacher && !isStudent) {
          debug(
            "socket:collab",
            `User not in active collaboration: ${socket.data.user.email}`
          );
          return socket.emit("error", {
            message: "You are not in an active collaboration",
          });
        }

        const roomId = `collab_${collaborationId}`;
        const author = isTeacher ? "teacher" : "student";

        // Broadcast code update to the collaboration room
        socket.to(roomId).emit("collaborationCodeUpdate", {
          code,
          language,
          author,
          timestamp: new Date(),
        });

        // Save code version to database
        await Collaboration.findByIdAndUpdate(collaborationId, {
          $push: {
            codeVersions: {
              code,
              language,
              timestamp: new Date(),
              author,
            },
          },
        });

        debug(
          "socket:collab",
          `Collaboration code updated by ${author} in room ${roomId}`
        );
      } catch (error) {
        console.error("Error updating collaboration code:", error);
        socket.emit("error", { message: "Failed to update code" });
      }
    }
  );

  /**
   * Join teacher's channel
   * Allows a teacher to join their notification channel
   */
  socket.on("join-teacher-channel", async (data) => {
    const { teacherId, courseId } = data;

    try {
      // Join the teacher's channel
      socket.join(`teacher:${teacherId}`);
      socket.data.teacherId = teacherId;
      socket.data.role = "teacher";

      debug(
        "socket:channel",
        `Teacher ${teacherId} joined channel teacher:${teacherId}`
      );
    } catch (error) {
      console.error("Error joining teacher channel:", error);
      socket.emit("error", { message: "Failed to join teacher channel" });
    }
  });

  /**
   * Join student's channel
   * Allows a student to join their notification channel
   */
  socket.on("join-student-channel", async (data) => {
    const { studentId, courseId } = data;

    try {
      // Join the student's channel
      socket.join(`student:${studentId}`);
      socket.data.studentId = studentId;
      socket.data.role = "student";

      debug(
        "socket:channel",
        `Student ${studentId} joined channel student:${studentId}`
      );
    } catch (error) {
      console.error("Error joining student channel:", error);
      socket.emit("error", { message: "Failed to join student channel" });
    }
  });

  /**
   * Disconnect handler
   * Cleans up when a user disconnects
   */
  socket.on("disconnect", async () => {
    try {
      const { roomId } = socket.data;
      const userEmail = socket.data.user?.email;
      const userName = socket.data.user?.name;

      debug(
        "socket",
        `Client disconnected: ${socket.id} (${userName || "Unknown"})`
      );

      // Handle regular room disconnection
      if (roomId && activeRooms.has(roomId)) {
        const roomData = activeRooms.get(roomId);

        // Remove participant from room
        const participantIndex = roomData.participants.findIndex(
          (p) => p.socketId === socket.id
        );

        if (participantIndex !== -1) {
          const participant = roomData.participants[participantIndex];
          roomData.participants.splice(participantIndex, 1);

          // Notify room about participant leaving
          socket.to(roomId).emit("participantLeft", {
            participantId: socket.id,
            participantName: participant.name,
            participantRole: participant.role,
          });

          debug("socket:room", `User ${participant.name} left room ${roomId}`);

          // Parse room ID
          const [roomCourseId, roomChapterId] = roomId.split("_");

          // Update database
          await CodeSession.updateOne(
            { courseId: roomCourseId, chapterId: roomChapterId },
            {
              $pull: { participants: { socketId: socket.id } },
              $set: { updatedAt: new Date() },
            }
          );

          // If room is empty, remove from memory
          if (roomData.participants.length === 0) {
            activeRooms.delete(roomId);
            debug("socket:room", `Room ${roomId} removed (empty)`);
          }
        }
      }

      // Handle collaboration disconnection
      if (userEmail) {
        // Check if user is a teacher in a collaboration
        if (activeCollaborations.has(userEmail)) {
          const collab = activeCollaborations.get(userEmail);

          debug(
            "socket:collab",
            `Teacher ${userEmail} disconnected from collaboration with ${collab.studentEmail}`
          );

          // Notify student that teacher disconnected
          io.to(collab.studentSocketId).emit("collaborationEnded", {
            reason: "teacher_disconnected",
            message: "The teacher has disconnected. Collaboration ended.",
          });

          // Update collaboration in database
          await Collaboration.findByIdAndUpdate(collab.collaborationId, {
            status: "terminated",
            endedAt: new Date(),
          });

          // Remove from active collaborations
          studentCollaborations.delete(collab.studentEmail);
          activeCollaborations.delete(userEmail);
        }

        // Check if user is a student in a collaboration
        if (studentCollaborations.has(userEmail)) {
          const collab = studentCollaborations.get(userEmail);

          debug(
            "socket:collab",
            `Student ${userEmail} disconnected from collaboration with ${collab.teacherEmail}`
          );

          // Notify teacher that student disconnected
          io.to(collab.teacherSocketId).emit("collaborationEnded", {
            reason: "student_disconnected",
            message: "The student has disconnected. Collaboration ended.",
          });

          // Update collaboration in database
          await Collaboration.findByIdAndUpdate(collab.collaborationId, {
            status: "terminated",
            endedAt: new Date(),
          });

          // Remove from active collaborations
          activeCollaborations.delete(collab.teacherEmail);
          studentCollaborations.delete(userEmail);
        }
      }
    } catch (error) {
      console.error("Error handling disconnect:", error);
    }
  });
});

// io.on("connection", (socket) => {
//   debug("socket", `New client connected: ${socket.id}`);
//   // console.log("New client connected:", socket.id);

//   // Extract user info from query parameters
//   const {
//     courseId,
//     chapterId,
//     sectionOrder,
//     userName,
//     userEmail,
//     userRole,
//     userAvatar,
//   } = socket.handshake.query;

//   // Store user data in socket
//   socket.data.user = {
//     name: userName,
//     email: userEmail,
//     role: userRole,
//     avatar: userAvatar,
//   };

//   debug("socket:user", `User connected: ${userName} (${userRole})`, {
//     email: userEmail,
//     courseId,
//     chapterId,
//   });

//   /**
//    * Join room handler
//    * Creates or joins a code editing room for a specific course and chapter
//    */
//   socket.on("joinRoom", async ({ room }) => {
//     try {
//       // Join the socket room
//       socket.join(room);
//       socket.data.roomId = room;

//       debug("socket:room", `User ${userName} joining room ${room}`);

//       // Parse room ID to get course and chapter info
//       const [roomCourseId, roomChapterId] = room.split("_");

//       // Create participant object
//       const participant = {
//         userId: socket.id,
//         name: userName,
//         email: userEmail,
//         avatar: userAvatar,
//         role: userRole,
//         socketId: socket.id,
//       };

//       // Check if room exists in memory
//       if (!activeRooms.has(room)) {
//         debug("socket:room", `Creating new room in memory: ${room}`);

//         // Check if session exists in database
//         let session = await CodeSession.findOne({
//           courseId: roomCourseId,
//           chapterId: roomChapterId,
//         });

//         if (!session) {
//           debug("socket:room", `Creating new session in database for room: ${room}`);

//           // Create new session
//           session = new CodeSession({
//             courseId: roomCourseId,
//             chapterId: roomChapterId,
//             sectionOrder,
//             participants: [participant],
//           });
//           await session.save();
//         } else {
//           debug("socket:room", `Updating existing session for room: ${room}`);

//           // Update existing session with new participant
//           session.participants.push(participant);
//           session.updatedAt = new Date();
//           await session.save();
//         }

//         // Store session in memory
//         activeRooms.set(room, {
//           participants: [participant],
//           code: session.code,
//           language: session.language,
//         });
//       } else {
//         debug("socket:room", `Adding participant to existing room: ${room}`);

//         // Add participant to existing room
//         const roomData = activeRooms.get(room);
//         roomData.participants.push(participant);

//         // Update database
//         await CodeSession.updateOne(
//           { courseId: roomCourseId, chapterId: roomChapterId },
//           {
//             $push: { participants: participant },
//             $set: { updatedAt: new Date() },
//           }
//         );
//       }

//       // Get current room data
//       const roomData = activeRooms.get(room);

//       // Notify room about new participant
//       socket.to(room).emit("participantJoined", { participant });

//       // Send room data to the new participant
//       socket.emit("roomJoined", {
//         room,
//         participants: roomData.participants,
//         code: roomData.code,
//         language: roomData.language,
//       });

//       // console.log(`User ${userName} joined room ${room}`);
//       debug("socket:room", `User ${userName} successfully joined room ${room}`);
//     } catch (error) {
//       console.error("Error joining room:", error);
//       socket.emit("error", { message: "Failed to join room" });
//     }
//   });

//   /**
//    * Code update handler
//    * Broadcasts code changes to all participants in the room
//    */
//   socket.on("updateCode", async ({ roomId, code }) => {
//     try {
//       // Update code in memory
//       if (activeRooms.has(roomId)) {
//         activeRooms.get(roomId).code = code;
//       }

//       // Broadcast to room
//       socket.to(roomId).emit("codeUpdate", { code });

//       // Parse room ID
//       const [roomCourseId, roomChapterId] = roomId.split("_");

//       // Update in database (debounced)
//       clearTimeout(socket.data.codeUpdateTimeout);
//       socket.data.codeUpdateTimeout = setTimeout(async () => {
//         await CodeSession.updateOne(
//           { courseId: roomCourseId, chapterId: roomChapterId },
//           { $set: { code, updatedAt: new Date() } }
//         );
//       }, 2000); // Debounce for 2 seconds
//     } catch (error) {
//       console.error("Error updating code:", error);
//     }
//   });

//   // Language change handler
//   socket.on("languageChange", async ({ roomId, language }) => {
//     try {
//       // Update language in memory
//       if (activeRooms.has(roomId)) {
//         activeRooms.get(roomId).language = language;
//       }

//       // Broadcast to room
//       socket.to(roomId).emit("languageChange", { language });

//       // Parse room ID
//       const [roomCourseId, roomChapterId] = roomId.split("_");

//       // Update in database
//       await CodeSession.updateOne(
//         { courseId: roomCourseId, chapterId: roomChapterId },
//         { $set: { language, updatedAt: new Date() } }
//       );
//     } catch (error) {
//       console.error("Error changing language:", error);
//     }
//   });

//   // Code output handler
//   socket.on("codeOutput", ({ roomId, output }) => {
//     socket.to(roomId).emit("codeOutput", { output });
//   });

//   // Help request handler
//   socket.on(
//     "requestHelp",
//     async ({
//       roomId,
//       studentName,
//       studentEmail,
//       studentAvatar,
//       code,
//       language,
//       message,
//     }) => {
//       try {
//         const [roomCourseId, roomChapterId] = roomId.split("_");

//         // Check if student is already in a collaboration
//         if (studentCollaborations.has(studentEmail)) {
//           return socket.emit("error", {
//             message:
//               "You are already in an active collaboration. Please end it before requesting new help.",
//           });
//         }

//         console.log("Help request received:", {
//           courseId: roomCourseId,
//           chapterId: roomChapterId,
//           studentName,
//           studentEmail,
//           message,
//         });

//         // Create help request in database
//         const helpRequest = new HelpRequest({
//           courseId: roomCourseId,
//           chapterId: roomChapterId,
//           sectionOrder,
//           studentId: socket.id,
//           studentName,
//           studentEmail,
//           studentAvatar,
//           code,
//           language,
//           message,
//           codeVersions: [
//             {
//               code,
//               timestamp: new Date(),
//               author: "student",
//             },
//           ],
//         });

//         await helpRequest.save();

//         // Find instructors in the room
//         const roomData = activeRooms.get(roomId);
//         if (roomData) {
//           const instructors = roomData.participants.filter(
//             (p) => p.role === "instructor"
//           );

//           // Notify instructors about help request
//           instructors.forEach((instructor) => {
//             io.to(instructor.socketId).emit("helpRequest", {
//               helpRequestId: helpRequest._id,
//               studentName,
//               studentEmail,
//               studentAvatar,
//               code,
//               language,
//               message,
//               roomId,
//               preview:
//                 code.substring(0, 100) + (code.length > 100 ? "..." : ""),
//               timestamp: helpRequest.createdAt,
//             });
//           });
//         }

//         // Notify student that request was sent
//         socket.emit("helpRequestSent", {
//           helpRequestId: helpRequest._id,
//           status: "pending",
//         });

//         console.log(`Help request created by ${studentName} in room ${roomId}`);
//       } catch (error) {
//         console.error("Error creating help request:", error);
//         socket.emit("error", { message: "Failed to create help request" });
//       }
//     }
//   );

//   // Help response handler - UPDATED to handle collaboration
//   socket.on(
//     "helpResponse",
//     async ({ helpRequestId, studentSocketId, studentEmail, status }) => {
//       try {
//         // Update help request in database
//         const helpRequest = await HelpRequest.findById(helpRequestId);

//         if (!helpRequest) {
//           return socket.emit("error", { message: "Help request not found" });
//         }

//         // Check if teacher is already in a collaboration
//         if (
//           activeCollaborations.has(socket.data.user.email) &&
//           status === "accepted"
//         ) {
//           // Get current collaboration
//           const currentCollab = activeCollaborations.get(
//             socket.data.user.email
//           );

//           // Notify current student that teacher is ending collaboration to help someone else
//           io.to(currentCollab.studentSocketId).emit("collaborationEnded", {
//             reason: "teacher_switched",
//             message: `${socket.data.user.name} has ended this collaboration to help another student.`,
//           });

//           // End current collaboration in database
//           await Collaboration.findByIdAndUpdate(currentCollab.collaborationId, {
//             status: "terminated",
//             endedAt: new Date(),
//           });

//           // Remove from active collaborations
//           studentCollaborations.delete(currentCollab.studentEmail);
//           activeCollaborations.delete(socket.data.user.email);

//           console.log(
//             `Ended existing collaboration with ${currentCollab.studentEmail} to help ${studentEmail}`
//           );
//         }

//         helpRequest.status = status;
//         helpRequest.teacherId = socket.id;
//         helpRequest.teacherName = socket.data.user.name;
//         helpRequest.updatedAt = new Date();

//         await helpRequest.save();

//         // Notify student
//         io.to(studentSocketId).emit("helpRequestResponse", {
//           helpRequestId,
//           status,
//           teacherName: socket.data.user.name,
//         });

//         // If accepted, create a collaboration
//         if (status === "accepted") {
//           // Create collaboration room ID
//           const collaborationRoomId = `collab_${helpRequestId}`;

//           // Create collaboration in database
//           const collaboration = new Collaboration({
//             courseId: helpRequest.courseId,
//             chapterId: helpRequest.chapterId,
//             sectionOrder: helpRequest.sectionOrder,
//             teacherId: socket.data.user.email,
//             teacherName: socket.data.user.name,
//             teacherEmail: socket.data.user.email,
//             teacherSocketId: socket.id,
//             studentId: helpRequest.studentId,
//             studentName: helpRequest.studentName,
//             studentEmail: helpRequest.studentEmail,
//             studentSocketId: studentSocketId,
//             helpRequestId: helpRequestId,
//             codeVersions: [
//               {
//                 code: helpRequest.code,
//                 language: helpRequest.language,
//                 timestamp: new Date(),
//                 author: "student",
//               },
//             ],
//           });

//           await collaboration.save();

//           // Track active collaborations
//           activeCollaborations.set(socket.data.user.email, {
//             studentEmail: helpRequest.studentEmail,
//             studentSocketId: studentSocketId,
//             collaborationId: collaboration._id,
//             roomId: collaborationRoomId,
//           });

//           studentCollaborations.set(helpRequest.studentEmail, {
//             teacherEmail: socket.data.user.email,
//             teacherSocketId: socket.id,
//             collaborationId: collaboration._id,
//             roomId: collaborationRoomId,
//           });

//           // Join both users to the collaboration room
//           socket.join(collaborationRoomId);
//           io.sockets.sockets.get(studentSocketId)?.join(collaborationRoomId);

//           // Notify both users about the collaboration
//           io.to(collaborationRoomId).emit("collaborationStarted", {
//             collaborationId: collaboration._id,
//             roomId: collaborationRoomId,
//             teacher: {
//               name: socket.data.user.name,
//               email: socket.data.user.email,
//               socketId: socket.id,
//             },
//             student: {
//               name: helpRequest.studentName,
//               email: helpRequest.studentEmail,
//               socketId: studentSocketId,
//             },
//             initialCode: helpRequest.code,
//             language: helpRequest.language,
//           });

//           console.log(
//             `Collaboration started between ${socket.data.user.name} and ${helpRequest.studentName}`
//           );
//         }

//         console.log(
//           `Help request ${helpRequestId} ${status} by ${socket.data.user.name}`
//         );
//       } catch (error) {
//         console.error("Error responding to help request:", error);
//         socket.emit("error", { message: "Failed to respond to help request" });
//       }
//     }
//   );

//   // NEW: End collaboration handler
//   socket.on("endCollaboration", async ({ collaborationId, reason }) => {
//     try {
//       const collaboration = await Collaboration.findById(collaborationId);

//       if (!collaboration) {
//         return socket.emit("error", { message: "Collaboration not found" });
//       }

//       // Check if user is part of this collaboration
//       const isTeacher = collaboration.teacherEmail === socket.data.user.email;
//       const isStudent = collaboration.studentEmail === socket.data.user.email;

//       if (!isTeacher && !isStudent) {
//         return socket.emit("error", {
//           message: "You are not part of this collaboration",
//         });
//       }

//       // Update collaboration status
//       collaboration.status = "ended";
//       collaboration.endedAt = new Date();
//       await collaboration.save();

//       // Remove from active collaborations
//       if (isTeacher) {
//         activeCollaborations.delete(collaboration.teacherEmail);
//         studentCollaborations.delete(collaboration.studentEmail);
//       } else {
//         activeCollaborations.delete(collaboration.teacherEmail);
//         studentCollaborations.delete(collaboration.studentEmail);
//       }

//       // Notify both users
//       const roomId = `collab_${collaboration._id}`;
//       io.to(roomId).emit("collaborationEnded", {
//         collaborationId,
//         endedBy: isTeacher ? "teacher" : "student",
//         reason: reason || "user_ended",
//         message: `Collaboration ended by ${isTeacher ? "teacher" : "student"}`,
//       });

//       // Leave the room
//       socket.leave(roomId);

//       console.log(
//         `Collaboration ${collaborationId} ended by ${
//           isTeacher ? "teacher" : "student"
//         }`
//       );
//     } catch (error) {
//       console.error("Error ending collaboration:", error);
//       socket.emit("error", { message: "Failed to end collaboration" });
//     }
//   });

//   // NEW: Collaboration code update handler
//   socket.on(
//     "collaborationCodeUpdate",
//     async ({ collaborationId, code, language }) => {
//       try {
//         // Determine if user is teacher or student
//         const isTeacher = activeCollaborations.has(socket.data.user.email);
//         const isStudent = studentCollaborations.has(socket.data.user.email);

//         if (!isTeacher && !isStudent) {
//           return socket.emit("error", {
//             message: "You are not in an active collaboration",
//           });
//         }

//         const roomId = `collab_${collaborationId}`;
//         const author = isTeacher ? "teacher" : "student";

//         // Broadcast code update to the collaboration room
//         socket.to(roomId).emit("collaborationCodeUpdate", {
//           code,
//           language,
//           author,
//           timestamp: new Date(),
//         });

//         // Save code version to database
//         await Collaboration.findByIdAndUpdate(collaborationId, {
//           $push: {
//             codeVersions: {
//               code,
//               language,
//               timestamp: new Date(),
//               author,
//             },
//           },
//         });

//         console.log(
//           `Collaboration code updated by ${author} in room ${roomId}`
//         );
//       } catch (error) {
//         console.error("Error updating collaboration code:", error);
//         socket.emit("error", { message: "Failed to update code" });
//       }
//     }
//   );

//   // NEW: Join teacher's channel
//   socket.on("join-teacher-channel", async (data) => {
//     const { teacherId, courseId } = data;

//     try {
//       // Join the teacher's channel
//       socket.join(`teacher:${teacherId}`);
//       socket.data.teacherId = teacherId;
//       socket.data.role = "teacher";

//       console.log(`Teacher ${teacherId} joined channel teacher:${teacherId}`);
//     } catch (error) {
//       console.error("Error joining teacher channel:", error);
//       socket.emit("error", { message: "Failed to join teacher channel" });
//     }
//   });

//   // NEW: Join student's channel
//   socket.on("join-student-channel", async (data) => {
//     const { studentId, courseId } = data;

//     try {
//       // Join the student's channel
//       socket.join(`student:${studentId}`);
//       socket.data.studentId = studentId;
//       socket.data.role = "student";

//       console.log(`Student ${studentId} joined channel student:${studentId}`);
//     } catch (error) {
//       console.error("Error joining student channel:", error);
//       socket.emit("error", { message: "Failed to join student channel" });
//     }
//   });

//   // Disconnect handler
//   socket.on("disconnect", async () => {
//     try {
//       const { roomId } = socket.data;
//       const userEmail = socket.data.user?.email;

//       // Handle regular room disconnection
//       if (roomId && activeRooms.has(roomId)) {
//         const roomData = activeRooms.get(roomId);

//         // Remove participant from room
//         const participantIndex = roomData.participants.findIndex(
//           (p) => p.socketId === socket.id
//         );

//         if (participantIndex !== -1) {
//           const participant = roomData.participants[participantIndex];
//           roomData.participants.splice(participantIndex, 1);

//           // Notify room about participant leaving
//           socket.to(roomId).emit("participantLeft", {
//             participantId: socket.id,
//             participantName: participant.name,
//             participantRole: participant.role,
//           });

//           console.log(`User ${participant.name} left room ${roomId}`);

//           // Parse room ID
//           const [roomCourseId, roomChapterId] = roomId.split("_");

//           // Update database
//           await CodeSession.updateOne(
//             { courseId: roomCourseId, chapterId: roomChapterId },
//             {
//               $pull: { participants: { socketId: socket.id } },
//               $set: { updatedAt: new Date() },
//             }
//           );

//           // If room is empty, remove from memory
//           if (roomData.participants.length === 0) {
//             activeRooms.delete(roomId);
//           }
//         }
//       }

//       // Handle collaboration disconnection
//       if (userEmail) {
//         // Check if user is a teacher in a collaboration
//         if (activeCollaborations.has(userEmail)) {
//           const collab = activeCollaborations.get(userEmail);

//           // Notify student that teacher disconnected
//           io.to(collab.studentSocketId).emit("collaborationEnded", {
//             reason: "teacher_disconnected",
//             message: "The teacher has disconnected. Collaboration ended.",
//           });

//           // Update collaboration in database
//           await Collaboration.findByIdAndUpdate(collab.collaborationId, {
//             status: "terminated",
//             endedAt: new Date(),
//           });

//           // Remove from active collaborations
//           studentCollaborations.delete(collab.studentEmail);
//           activeCollaborations.delete(userEmail);

//           console.log(
//             `Teacher ${userEmail} disconnected, ending collaboration with ${collab.studentEmail}`
//           );
//         }

//         // Check if user is a student in a collaboration
//         if (studentCollaborations.has(userEmail)) {
//           const collab = studentCollaborations.get(userEmail);

//           // Notify teacher that student disconnected
//           io.to(collab.teacherSocketId).emit("collaborationEnded", {
//             reason: "student_disconnected",
//             message: "The student has disconnected. Collaboration ended.",
//           });

//           // Update collaboration in database
//           await Collaboration.findByIdAndUpdate(collab.collaborationId, {
//             status: "terminated",
//             endedAt: new Date(),
//           });

//           // Remove from active collaborations
//           activeCollaborations.delete(collab.teacherEmail);
//           studentCollaborations.delete(userEmail);

//           console.log(
//             `Student ${userEmail} disconnected, ending collaboration with ${collab.teacherEmail}`
//           );
//         }
//       }
//     } catch (error) {
//       console.error("Error handling disconnect:", error);
//     }

//     console.log("Client disconnected:", socket.id);
//   });
// });

// Use routes
app.use("/api", helpRequestRoutes);
app.use("/api", collaborationRoutes);

// API routes
app.get("/api/code-sessions/:courseId/:chapterId", async (req, res) => {
  try {
    const { courseId, chapterId } = req.params;

    const session = await CodeSession.findOne({
      courseId,
      chapterId,
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json(session);
  } catch (error) {
    console.error("Error fetching code session:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export { app, server, io };
