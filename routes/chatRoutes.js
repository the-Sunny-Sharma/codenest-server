import express from "express";
import Chat from "../models/LiveChats.js";

const router = express.Router();

// Get chat messages for a specific stream
router.get("/:courseId/:sectionOrder/:chapterId", async (req, res) => {
  try {
    const { courseId, sectionOrder, chapterId } = req.params;
    const { limit = 50, before } = req.query;

    const query = {
      courseId,
      sectionOrder,
      chapterId,
    };

    // If 'before' timestamp is provided, get messages before that time
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Chat.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .lean();

    // Add isTeacher flag to messages
    const messagesWithTeacherFlag = messages.map((msg) => ({
      ...msg,
      isTeacher: msg.email.includes("teacher") || msg.email.includes("admin"),
    }));

    res.status(200).json(messagesWithTeacherFlag.reverse()); // Reverse to get chronological order
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ message: "Failed to fetch chat messages" });
  }
});

// Delete a chat message (teachers only)
router.delete("/:messageId", async (req, res) => {
  try {
    const { messageId } = req.params;
    const { email } = req.body; // In a real app, you would get this from auth middleware

    // Check if user is a teacher (simple check for demo)
    const isTeacher =
      email && (email.includes("teacher") || email.includes("admin"));
    if (!isTeacher) {
      return res
        .status(403)
        .json({ message: "Only teachers can delete messages" });
    }

    const message = await Chat.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    await Chat.findByIdAndDelete(messageId);
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat message:", error);
    res.status(500).json({ message: "Failed to delete chat message" });
  }
});

// Pin a message (teachers only)
router.post("/pin/:messageId", async (req, res) => {
  try {
    const { messageId } = req.params;
    const { email } = req.body; // In a real app, you would get this from auth middleware

    // Check if user is a teacher (simple check for demo)
    const isTeacher =
      email && (email.includes("teacher") || email.includes("admin"));
    if (!isTeacher) {
      return res
        .status(403)
        .json({ message: "Only teachers can pin messages" });
    }

    const message = await Chat.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Update the message to mark it as pinned
    message.isPinned = true;
    await message.save();

    res.status(200).json({ message: "Message pinned successfully" });
  } catch (error) {
    console.error("Error pinning chat message:", error);
    res.status(500).json({ message: "Failed to pin chat message" });
  }
});

export default router;
