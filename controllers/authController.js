//const { generateToken } = require("../config/jwtConfig");
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const username = email.split("@")[0];

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO Users (name, username, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [name, username, email, hashedPassword, role]
    );

    const token = jwt.sign(
      { id: result.insertId, role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [users] = await db.query("SELECT * FROM Users WHERE username = ?", [
      username,
    ]);
    const user = users[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send("Invalid credentials");
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// exports.register = async (req, res) => {
//   const { name, email, password, role } = req.body;

//   // Validate input
//   if (!name || !email || !password || !role) {
//     return res
//       .status(400)
//       .send("All fields (name, email, password, role) are required.");
//   }

// if (req.user.role !== "admin") {
//     return res
//       .status(403)
//       .send("Forbidden: Only admins can register new users.");
//   }

//   const username = email.split("@")[0];

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const [result] = await db.query(
//       "INSERT INTO Users (name, username, email, password, role) VALUES (?, ?, ?, ?, ?)",
//       [name, username, email, hashedPassword, role]
//     );

//     res.status(201).send(`User with role ${role} created successfully.`);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// };

// // Login for admin and farmer
// exports.login = async (req, res) => {
//   const { username, password } = req.body;

//   // Validate input
//   if (!username || !password) {
//     return res.status(400).send("Username and password are required.");
//   }

//   try {
//     // Check if the user exists
//     const [users] = await db.query("SELECT * FROM Users WHERE username = ?", [
//       username,
//     ]);
//     const user = users[0];

//     if (!user) {
//       return res.status(401).send("Invalid credentials.");
//     }

//     // Verify password
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).send("Invalid credentials.");
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user.id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     // Farmers can only log in if they've been created by an admin
//     if (user.role === "farmer" && !user.is_active) {
//       return res
//         .status(403)
//         .send("Forbidden: Farmer account is inactive. Contact admin.");
//     }

//     res.json({ token });
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// };
