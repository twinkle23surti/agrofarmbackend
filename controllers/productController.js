const db = require("../config/db");
exports.createAdminProduct = async (req, res) => {
  const { name, description, price } = req.body;
  const farmer_id = req.user.id; // Assuming req.user contains the authenticated user

  try {
    // Validate inputs
    if (!name || !price) {
      return res.status(400).send("Name and price are required");
    }

    // Check if the product already exists for this farmer
    const [existingProduct] = await db.query(
      "SELECT * FROM Products WHERE name = ? AND farmer_id = ?",
      [name, farmer_id]
    );

    if (existingProduct.length > 0) {
      return res.status(400).send("Product with this name already exists");
    }

    // Insert product into the database
    await db.query(
      "INSERT INTO Products (farmer_id, name, description, price, status) VALUES (?, ?, ?, ?, ?)",
      [farmer_id, name, description || null, price, "active"]
    );

    res.status(201).send("Product created successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Admin: Get all products
exports.getAdminProducts = async (req, res) => {
  try {
    const [products] = await db.query(
      "SELECT * FROM Products WHERE is_deleted = FALSE"
    );
    res.json(products);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Admin: Get a product by ID
exports.getAdminProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const [product] = await db.query(
      "SELECT * FROM Products WHERE id = ? AND is_deleted = FALSE",
      [id]
    );

    if (!product.length) {
      return res.status(404).send("Product not found");
    }

    res.json(product[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Admin: Update a product by ID
exports.updateAdminProductById = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE Products SET name = ?, description = ?, price = ?, quantity = ? WHERE id = ? AND is_deleted = FALSE",
      [name, description, price, quantity, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).send("Product not found or already deleted");
    }

    res.send("Product updated successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Admin: Delete a product by ID
exports.deleteAdminProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      "UPDATE Products SET is_deleted = TRUE WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).send("Product not found or already deleted");
    }

    res.send("Product deleted successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Get all products for the logged-in farmer
exports.getFarmerProducts = async (req, res) => {
  try {
    const [products] = await db.query(
      "SELECT * FROM Products WHERE farmer_id = ? AND is_deleted = FALSE",
      [req.user.id]
    );
    res.json(products);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Get a specific product by ID for the logged-in farmer
exports.getFarmerProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const [products] = await db.query(
      "SELECT * FROM Products WHERE id = ? AND farmer_id = ? AND is_deleted = FALSE",
      [id, req.user.id]
    );

    if (!products.length) {
      return res
        .status(404)
        .send("Product not found or not authorized to access");
    }

    res.json(products[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Request more products (Farmer specific functionality)
exports.requestFarmerMoreProducts = async (req, res) => {
  const { product_name, quantity_requested } = req.body;

  try {
    await db.query(
      "INSERT INTO ProductRequests (farmer_id, product_name, quantity_requested) VALUES (?, ?, ?)",
      [req.user.id, product_name, quantity_requested]
    );

    res.status(201).send("Product request submitted successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};
