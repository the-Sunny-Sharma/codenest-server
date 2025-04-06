import mongoose from "mongoose";

const CollaborationSchema = new mongoose.Schema({
  courseId: { type: String, required: true },
  chapterId: { type: String, required: true },
  sectionOrder: { type: String, required: true },
  teacherId: { type: String, required: true },
  teacherName: { type: String, required: true },
  teacherEmail: { type: String, required: true },
  teacherSocketId: { type: String, required: true },
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  studentSocketId: { type: String, required: true },
  helpRequestId: { type: String, required: true },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
  status: {
    type: String,
    enum: ["active", "ended", "terminated"],
    default: "active",
  },
  codeVersions: [
    {
      code: String,
      language: String,
      timestamp: Date,
      author: {
        type: String,
        enum: ["student", "teacher"],
      },
    },
  ],
});

export default mongoose.models.Collaboration ||
  mongoose.model("Collaboration", CollaborationSchema);
