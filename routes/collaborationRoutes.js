// import express from "express";
// import { io } from "../app.js";
// import Collaboration from "../models/Collaboration.js";

// const router = express.Router();

// // Get active collaboration for a teacher
// router.get("/collaborations/teacher/:email", async (req, res) => {
//   try {
//     const { email } = req.params;

//     const collaboration = await Collaboration.findOne({
//       teacherEmail: email,
//       status: "active",
//     }).sort({ startedAt: -1 });

//     if (!collaboration) {
//       return res.status(404).json({ message: "No active collaboration found" });
//     }

//     res.json(collaboration);
//   } catch (error) {
//     console.error("Error fetching teacher collaboration:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Get active collaboration for a student
// router.get("/collaborations/student/:email", async (req, res) => {
//   try {
//     const { email } = req.params;

//     const collaboration = await Collaboration.findOne({
//       studentEmail: email,
//       status: "active",
//     }).sort({ startedAt: -1 });

//     if (!collaboration) {
//       return res.status(404).json({ message: "No active collaboration found" });
//     }

//     res.json(collaboration);
//   } catch (error) {
//     console.error("Error fetching student collaboration:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Get collaboration by ID
// router.get("/collaborations/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     const collaboration = await Collaboration.findById(id);

//     if (!collaboration) {
//       return res.status(404).json({ message: "Collaboration not found" });
//     }

//     res.json(collaboration);
//   } catch (error) {
//     console.error("Error fetching collaboration:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // End collaboration
// router.post("/collaborations/:id/end", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { endedBy, reason } = req.body;

//     const collaboration = await Collaboration.findById(id);

//     if (!collaboration) {
//       return res.status(404).json({ message: "Collaboration not found" });
//     }

//     if (collaboration.status !== "active") {
//       return res.status(400).json({ message: "Collaboration is not active" });
//     }

//     collaboration.status = "ended";
//     collaboration.endedAt = new Date();
//     await collaboration.save();

//     // Notify participants
//     const roomId = `collab_${id}`;
//     io.to(roomId).emit("collaborationEnded", {
//       collaborationId: id,
//       endedBy,
//       reason,
//       message: `Collaboration ended by ${endedBy}`,
//     });

//     res.json({ success: true, message: "Collaboration ended successfully" });
//   } catch (error) {
//     console.error("Error ending collaboration:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Get collaboration history
// router.get("/collaborations/history/:email", async (req, res) => {
//   try {
//     const { email } = req.params;
//     const { role = "all", limit = 10, page = 1 } = req.query;

//     const skip = (page - 1) * limit;

//     const query = {};

//     if (role === "teacher") {
//       query.teacherEmail = email;
//     } else if (role === "student") {
//       query.studentEmail = email;
//     } else {
//       query.$or = [{ teacherEmail: email }, { studentEmail: email }];
//     }

//     const collaborations = await Collaboration.find(query)
//       .sort({ startedAt: -1 })
//       .skip(skip)
//       .limit(Number(limit));

//     const total = await Collaboration.countDocuments(query);

//     res.json({
//       collaborations,
//       pagination: {
//         total,
//         page: Number(page),
//         limit: Number(limit),
//         pages: Math.ceil(total / Number(limit)),
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching collaboration history:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// export default router;
import express from "express";
import Collaboration from "../models/Collaboration.js";

const router = express.Router();

// Get all collaborations for a course
router.get("/collaborations/course/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    const collaborations = await Collaboration.find({ courseId });
    res.json(collaborations);
  } catch (error) {
    console.error("Error fetching collaborations:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all collaborations for a teacher
router.get("/collaborations/teacher/:teacherEmail", async (req, res) => {
  try {
    const { teacherEmail } = req.params;
    const collaborations = await Collaboration.find({ teacherEmail });
    res.json(collaborations);
  } catch (error) {
    console.error("Error fetching teacher collaborations:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all collaborations for a student
router.get("/collaborations/student/:studentEmail", async (req, res) => {
  try {
    const { studentEmail } = req.params;
    const collaborations = await Collaboration.find({ studentEmail });
    res.json(collaborations);
  } catch (error) {
    console.error("Error fetching student collaborations:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a specific collaboration
router.get("/collaborations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const collaboration = await Collaboration.findById(id);

    if (!collaboration) {
      return res.status(404).json({ message: "Collaboration not found" });
    }

    res.json(collaboration);
  } catch (error) {
    console.error("Error fetching collaboration:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// End a collaboration
router.post("/collaborations/:id/end", async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const collaboration = await Collaboration.findById(id);

    if (!collaboration) {
      return res.status(404).json({ message: "Collaboration not found" });
    }

    collaboration.status = "ended";
    collaboration.endedAt = new Date();
    await collaboration.save();

    res.json({ message: "Collaboration ended successfully" });
  } catch (error) {
    console.error("Error ending collaboration:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
