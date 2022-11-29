const jwt = require("jsonwebtoken");

const secret = process.env.TOKEN_SECRET;
function JWTverify(req, res, next) {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    let verified = jwt.verify(token, secret);
    req.user = verified;
    next();
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid token" });
  }
}

module.exports = JWTverify;
