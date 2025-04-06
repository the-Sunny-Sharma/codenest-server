import express from "express";
import { io } from "../app.js";

const router = express.Router();

// Route to notify teachers about new help requests
router.post("/notifications/help-request", async (req, res) => {
  try {
    const {
      helpRequestId,
      teacherId,
      studentName,
      studentEmail,
      studentAvatar,
      courseId,
      chapterId,
      sectionOrder,
      language,
      timestamp,
      preview,
    } = req.body;

    // Emit the help request to the teacher's channel
    io.to(`teacher:${teacherId}`).emit("help-request", {
      helpRequestId,
      teacherId,
      studentName,
      studentEmail,
      studentAvatar,
      courseId,
      chapterId,
      sectionOrder,
      language,
      timestamp,
      preview,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending help request notification:", error);
    return res.status(500).json({ error: "Failed to send notification" });
  }
});

export default router;
