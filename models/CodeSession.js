// import mongoose from "mongoose";

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

// export default mongoose.models.CodeSession ||
//   mongoose.model("CodeSession", CodeSessionSchema);
import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "/placeholder.svg",
  },
  role: {
    type: String,
    enum: ["student", "instructor"],
    required: true,
  },
  socketId: {
    type: String,
    required: true,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

const codeSessionSchema = new mongoose.Schema(
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
    code: {
      type: String,
      default: "// Code here",
    },
    language: {
      type: String,
      default: "javascript",
    },
    participants: [participantSchema],
  },
  {
    timestamps: true,
  }
);

// Create a compound index for courseId and chapterId
codeSessionSchema.index({ courseId: 1, chapterId: 1 }, { unique: true });

const CodeSession = mongoose.model("CodeSession", codeSessionSchema);

export default CodeSession;
