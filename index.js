const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const vendorA = require("./data/vendorA.json");
const { error } = require("console");

const app = express();
app.use(cors());
app.use(express.json());

// ROUTES
app.get("/", (req, res) => {
  res.send("Rute ditemukan");
});

app.get("/vendor_a/minuman", (req, res) => {
  try {
    const filePath = path.join(__dirname, "data", "vendorA.json");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const jsonData = JSON.parse(fileContent);

    res.json(jsonData);
  } catch (error) {
    res.status(500).json({
      message: "Gagal membaca file json",
      error: error.message
    });
  }
});

if (require.main === module) {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server Vendor A berjalan di http://localhost:${PORT}`);
  });
}

module.exports = app;