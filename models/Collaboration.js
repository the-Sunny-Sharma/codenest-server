// import mongoose from "mongoose";

// const CollaborationSchema = new mongoose.Schema({
//   courseId: { type: String, required: true },
//   chapterId: { type: String, required: true },
//   sectionOrder: { type: String, required: true },
//   teacherId: { type: String, required: true },
//   teacherName: { type: String, required: true },
//   teacherEmail: { type: String, required: true },
//   teacherSocketId: { type: String, required: true },
//   studentId: { type: String, required: true },
//   studentName: { type: String, required: true },
//   studentEmail: { type: String, required: true },
//   studentSocketId: { type: String, required: true },
//   helpRequestId: { type: String, required: true },
//   startedAt: { type: Date, default: Date.now },
//   endedAt: { type: Date },
//   status: {
//     type: String,
//     enum: ["active", "ended", "terminated"],
//     default: "active",
//   },
//   codeVersions: [
//     {
//       code: String,
//       language: String,
//       timestamp: Date,
//       author: {
//         type: String,
//         enum: ["student", "teacher"],
//       },
//     },
//   ],
// });

// export default mongoose.models.Collaboration ||
//   mongoose.model("Collaboration", CollaborationSchema);
import mongoose from "mongoose";

const codeVersionSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: "javascript",
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

const collaborationSchema = new mongoose.Schema(
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
    teacherId: {
      type: String,
      required: true,
    },
    teacherName: {
      type: String,
      required: true,
    },
    teacherEmail: {
      type: String,
      required: true,
    },
    teacherSocketId: {
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
    studentSocketId: {
      type: String,
      required: true,
    },
    helpRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HelpRequest",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "ended", "terminated"],
      default: "active",
    },
    codeVersions: [codeVersionSchema],
    startedAt: {
      type: Date,
      default: Date.now,
    },
    endedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Collaboration = mongoose.model("Collaboration", collaborationSchema);

export default Collaboration;
