// middlewares/authDoctor.js
import jwt from "jsonwebtoken";

const authDoctor = (req, res, next) => {
  try {
    // Standard way: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Login Again",
      });
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer"
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.docId = decoded.id; // Attach doctor ID for controller use
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default authDoctor;
