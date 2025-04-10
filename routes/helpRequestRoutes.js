// import express from "express";
// import { io } from "../app.js";

// const router = express.Router();

// // Route to notify teachers about new help requests
// router.post("/notifications/help-request", async (req, res) => {
//   try {
//     const {
//       helpRequestId,
//       teacherId,
//       studentName,
//       studentEmail,
//       studentAvatar,
//       courseId,
//       chapterId,
//       sectionOrder,
//       language,
//       timestamp,
//       preview,
//     } = req.body;

//     // Emit the help request to the teacher's channel
//     io.to(`teacher:${teacherId}`).emit("help-request", {
//       helpRequestId,
//       teacherId,
//       studentName,
//       studentEmail,
//       studentAvatar,
//       courseId,
//       chapterId,
//       sectionOrder,
//       language,
//       timestamp,
//       preview,
//     });

//     return res.status(200).json({ success: true });
//   } catch (error) {
//     console.error("Error sending help request notification:", error);
//     return res.status(500).json({ error: "Failed to send notification" });
//   }
// });

// export default router;
import express from "express";
import HelpRequest from "../models/HelpRequest.js";

const router = express.Router();

// Get all help requests for a course
router.get("/help-request/course/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    const helpRequests = await HelpRequest.find({ courseId }).sort({
      createdAt: -1,
    });
    res.json(helpRequests);
  } catch (error) {
    console.error("Error fetching help requests:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all help requests for a teacher
router.get("/help-request/teacher/:teacherEmail", async (req, res) => {
  try {
    const { teacherEmail } = req.params;
    const helpRequests = await HelpRequest.find({ teacherEmail }).sort({
      createdAt: -1,
    });
    res.json(helpRequests);
  } catch (error) {
    console.error("Error fetching teacher help requests:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all help requests for a student
router.get("/help-request/student/:studentEmail", async (req, res) => {
  try {
    const { studentEmail } = req.params;
    const helpRequests = await HelpRequest.find({ studentEmail }).sort({
      createdAt: -1,
    });
    res.json(helpRequests);
  } catch (error) {
    console.error("Error fetching student help requests:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a specific help request
router.get("/help-request/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const helpRequest = await HelpRequest.findById(id);

    if (!helpRequest) {
      return res.status(404).json({ message: "Help request not found" });
    }

    res.json(helpRequest);
  } catch (error) {
    console.error("Error fetching help request:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new help request
router.post("/help-request", async (req, res) => {
  try {
    const {
      courseId,
      chapterId,
      sectionOrder,
      studentName,
      studentEmail,
      studentAvatar,
      code,
      language,
      message,
    } = req.body;

    const helpRequest = new HelpRequest({
      courseId,
      chapterId,
      sectionOrder,
      studentId: req.body.studentId || "socket-id-placeholder",
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

    res.status(201).json({
      message: "Help request created successfully",
      helpRequestId: helpRequest._id,
    });
  } catch (error) {
    console.error("Error creating help request:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a help request status
router.patch("/help-request/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, teacherId, teacherName } = req.body;

    const helpRequest = await HelpRequest.findById(id);

    if (!helpRequest) {
      return res.status(404).json({ message: "Help request not found" });
    }

    helpRequest.status = status;

    if (status === "accepted" && teacherId && teacherName) {
      helpRequest.teacherId = teacherId;
      helpRequest.teacherName = teacherName;
    }

    await helpRequest.save();

    res.json({ message: "Help request updated successfully" });
  } catch (error) {
    console.error("Error updating help request:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
