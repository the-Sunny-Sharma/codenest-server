import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    sectionOrder: {
      type: String,
      required: true,
    },
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    userId: {
      type: String, // Changed to String to accommodate socket IDs for simplicity
      required: true,
    },
    streamId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email validation
    },
    username: { type: String, required: true },
    avatarUrl: { type: String, required: true }, // No URL validation
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 500, // Max message length
    },
    videoTimestamp: {
      type: Number,
      required: true,
      min: 0, // Should not be negative
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create index for faster queries
chatSchema.index({ courseId: 1, sectionOrder: 1, chapterId: 1, createdAt: -1 });
chatSchema.index({ streamId: 1, createdAt: -1 });

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
