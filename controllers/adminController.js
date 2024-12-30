const db = require("../config/db");
const bcrypt = require("bcryptjs");

exports.createFarmer = async (req, res) => {
  const { name, email, password } = req.body;
  const username = email.split("@")[0];

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO Users (name, username, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [name, username, email, hashedPassword, "farmer"]
    );
    res.status(201).send("Farmer created successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getAllFarmers = async (req, res) => {
  try {
    const [farmers] = await db.query("SELECT use FROM Users WHERE role = ?", [
      "farmer",
    ]);
    res.json(farmers);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getFarmerById = async (req, res) => {
  const { id } = req.params;
  try {
    const [farmers] = await db.query(
      "SELECT * FROM Users WHERE id = ? AND role = ?",
      [id, "farmer"]
    );
    res.json(farmers[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// exports.deleteFarmer = async (req, res) => {
//   const { id } = req.params;
//   try {
//     await db.query("INSERT INTO DeletedFarmers (farmer_id) VALUES (?)", [id]);
//     res.send("Farmer soft-deleted");
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// };

//delete farmer

exports.deleteFarmer = async (req, res) => {
  const { id } = req.params;
  try {
    // First, check if the farmer exists
    const [farmer] = await db.query(
      "SELECT * FROM Users WHERE id = ? AND role = ?",
      [id, "farmer"]
    );
    if (farmer.length === 0) {
      return res.status(404).send("Farmer not found");
    }

   
    await db.query("DELETE FROM Users WHERE id = ? AND role = ?", [
      id,
      "farmer",
    ]);

    res.send("Farmer deleted permanently");
  } catch (err) {
    res.status(500).send(err.message);
  }
};


exports.updateFarmer = async (req, res) => {
  const { id } = req.params;
  const {name, email, password } = req.body;

  try {
    const [farmer] = await db.query(
      "SELECT * FROM Users WHERE id = ? AND role = ?",
      [id, "farmer"]
    );

    if (!farmer.length) {
      return res.status(404).send("Farmer not found");
    }

    let fieldsToUpdate = {};
    if (email) {
      fieldsToUpdate.email = email;
      fieldsToUpdate.username = email.split("@")[0];
    }
    if (password) {
      fieldsToUpdate.password = await bcrypt.hash(password, 10);
    }
    if (name) {
      fieldsToUpdate.name = name;
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).send("No valid fields provided to update");
    }

    const updates = Object.keys(fieldsToUpdate)
      .map((field) => `${field} = ?`)
      .join(", ");
    const values = [...Object.values(fieldsToUpdate), id];

    const query = `UPDATE Users SET ${updates} WHERE id = ? AND role = 'farmer'`;

    await db.query(query, values);

    res.send("Farmer updated successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};
