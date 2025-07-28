import jwt from "jsonwebtoken";

export default function authenticationMiddleware(req, res, next) {
  const token = req.header("X-Auth-Token");
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
