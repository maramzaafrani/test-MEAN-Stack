const jwt = require("jsonwebtoken");
require("dotenv").config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token requis" });
  }

  jwt.verify(token, accessTokenSecret, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token invalide" });
    req.user = decoded;
    next();
  });
};
