import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Gắn thông tin user vào request
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};
