const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const farmerRoutes = require("./routes/productRoutes");

const app = express();

app.use(bodyParser.json());
app.use(cors(["http://localhost:63663"]));


app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/product", farmerRoutes);

app.listen(process.env.PORT,'0.0.0.0', () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
