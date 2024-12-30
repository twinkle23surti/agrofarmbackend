// const { verifyToken } = require("../config/jwtConfig");
// const jwt = require("jsonwebtoken");

// const authenticate = (req, res, next) => {
//   const token = req.headers.authorization?.split("")[1];
//   if (!token) return res.status(401).send("Access Denied");

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).send("Invalid Token");
//     req.user = user;
//     next();
//   });
// };

// const authorize = (role) => (req, res, next) => {
//   if (req.user.role !== role) return res.status(403).send("Forbidden");
//   next();
// };

// module.exports = { authenticate, authorize};
