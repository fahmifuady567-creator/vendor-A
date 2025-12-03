const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// Helper
function readData() {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, "data", "vendorA.json"), "utf8")
  );
}

function writeData(data) {
  fs.writeFileSync(
    path.join(__dirname, "data", "vendorA.json"),
    JSON.stringify(data, null, 2)
  );
}

// ROUTES
app.get("/", (req, res) => {
  res.json(readData());
});

app.get("/vendor_a/:id", (req, res) => {
  const data = readData();
  const item = data.find((p) => p.kd_produk === req.params.id);

  if (!item) {
    return res.status(404).json({ error: "Produk tidak ditemukan" });
  }

  res.json(item);
});

app.post("/", (req, res) => {
  const { kd_produk, nm_brg, hrg, ket_stok } = req.body;
  const data = readData();

  if (!kd_produk || data.some((p) => p.kd_produk === kd_produk)) {
    return res.status(409).json({ error: "Kode produk sudah ada / tidak valid" });
  }

  const newProduct = { kd_produk, nm_brg, hrg, ket_stok };
  data.push(newProduct);
  writeData(data);

  res.status(201).json({ message: "Produk berhasil ditambahkan", data: newProduct });
});

app.put("/update_vendor_a/:id", (req, res) => {
  const data = readData();
  const index = data.findIndex((p) => p.kd_produk === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "Produk tidak ditemukan" });
  }

  data[index] = { ...data[index], ...req.body };
  writeData(data);

  res.json({ message: "Produk berhasil diperbarui", data: data[index] });
});

app.delete("/delete_vendor_a/:id", (req, res) => {
  const data = readData();
  const index = data.findIndex((p) => p.kd_produk === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "Produk tidak ditemukan" });
  }

  const deleted = data.splice(index, 1);
  writeData(data);

  res.json({ message: "Produk berhasil dihapus", deleted: deleted[0] });
});

// EXPORT untuk VERCEL
module.exports = app;

// LISTEN untuk LOKAL
if (require.main === module) {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}
