import mongoose from "mongoose";

const CodeSessionSchema = new mongoose.Schema({
  courseId: { type: String, required: true },
  chapterId: { type: String, required: true },
  sectionOrder: { type: String, required: true },
  code: { type: String, default: "// Write your code here" },
  language: { type: String, default: "javascript" },
  participants: [
    {
      userId: String,
      name: String,
      email: String,
      avatar: String,
      role: String,
      socketId: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.CodeSession ||
  mongoose.model("CodeSession", CodeSessionSchema);
