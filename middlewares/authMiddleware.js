// Simple authentication middleware
// In a real app, you would use JWT or session-based auth
const authMiddleware = (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(401).json({ message: "Authentication required" });
  }

  // Attach user to request
  req.user = {
    email,
    isTeacher: email.includes("teacher") || email.includes("admin"),
  };

  next();
};

// Middleware to check if user is a teacher
const isTeacher = (req, res, next) => {
  if (!req.user || !req.user.isTeacher) {
    return res
      .status(403)
      .json({ message: "Only teachers can perform this action" });
  }

  next();
};

export { authMiddleware, isTeacher };
