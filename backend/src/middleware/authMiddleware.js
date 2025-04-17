import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
    // console.log("📥 req.headers:", req.headers);
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        console.log("⛔ Không có authorization header");
        return res.status(403).json({ error: "Access denied, no token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        console.log("⛔ Authorization header có nhưng không có token:", authHeader);
        return res.status(403).json({ error: "Access denied, no token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token OK:", decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("❌ Token INVALID:", error.message);
        res.status(401).json({ error: "Invalid or expired token" });
    }
};
