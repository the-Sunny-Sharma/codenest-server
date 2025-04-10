// import mongoose from "mongoose";

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
//   message: { type: String, required: true },
//   status: {
//     type: String,
//     enum: ["pending", "accepted", "rejected", "completed"],
//     default: "pending",
//   },
//   teacherId: { type: String },
//   teacherName: { type: String },
//   teacherEmail: { type: String },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
//   collaborationId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Collaboration",
//   },
//   codeVersions: [
//     {
//       code: String,
//       timestamp: Date,
//       author: {
//         type: String,
//         enum: ["student", "teacher"],
//       },
//     },
//   ],
// });

// export default mongoose.models.HelpRequest ||
//   mongoose.model("HelpRequest", HelpRequestSchema);
import mongoose from "mongoose";

const codeVersionSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: String,
    enum: ["student", "teacher"],
    required: true,
  },
});

const helpRequestSchema = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: true,
    },
    chapterId: {
      type: String,
      required: true,
    },
    sectionOrder: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    studentEmail: {
      type: String,
      required: true,
    },
    studentAvatar: {
      type: String,
      default: "/placeholder.svg",
    },
    teacherId: {
      type: String,
    },
    teacherName: {
      type: String,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: "javascript",
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
    codeVersions: [codeVersionSchema],
  },
  {
    timestamps: true,
  }
);

const HelpRequest = mongoose.model("HelpRequest", helpRequestSchema);

export default HelpRequest;
