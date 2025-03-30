import jwt from "jsonwebtoken";

/**
 * Verify and decode NextAuth session token
 * @param {string} token - The authjs.session-token from frontend
 * @returns {object|null} - Decoded user object or null if invalid
 */

export const verifyToken = (token) => {
  console.log("Received Token", token);
  try {
    const secret = process.env.AUTH_SECRET; //Use NextAuth secret
    if (!secret) throw new Error("AUTH_SECRET is missing in env file");

    const decoded = jwt.verify(token, secret); //Verify token
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};
