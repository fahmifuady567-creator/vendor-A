const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());

// ========== Helper Functions ==========
function readData() {
  return JSON.parse(fs.readFileSync("./data/vendorA.json", "utf8"));
}

function writeData(data) {
  fs.writeFileSync("./data/vendorA.json", JSON.stringify(data, null, 2));
}

// ========== ROUTES (semua di root "/") ==========

// GET semua produk
app.get("/", (req, res) => {
  const data = readData();
  res.json(data);
});

// GET produk by ID
app.get("/:id", (req, res) => {
  const id = req.params.id;
  const data = readData();
  const item = data.find((p) => p.kd_produk === id);

  if (!item) {
    return res.status(404).json({ error: "Produk tidak ditemukan" });
  }

  res.json(item);
});

// POST tambah produk
app.post("/", (req, res) => {
  const { kd_produk, nm_brg, hrg, ket_stok } = req.body;

  if (!kd_produk || !nm_brg || !hrg || !ket_stok) {
    return res.status(400).json({ error: "Semua field wajib diisi" });
  }

  const data = readData();

  if (data.some((p) => p.kd_produk === kd_produk)) {
    return res.status(409).json({ error: "Kode produk sudah ada" });
  }

  const newProduct = { kd_produk, nm_brg, hrg, ket_stok };
  data.push(newProduct);

  writeData(data);

  res.status(201).json({
    message: "Produk berhasil ditambahkan",
    data: newProduct,
  });
});

// PUT update produk
app.put("/:id", (req, res) => {
  const id = req.params.id;
  const data = readData();
  const index = data.findIndex((p) => p.kd_produk === id);

  if (index === -1) {
    return res.status(404).json({ error: "Produk tidak ditemukan" });
  }

  const updated = { ...data[index], ...req.body };
  data[index] = updated;

  writeData(data);

  res.json({
    message: "Produk berhasil diperbarui",
    data: updated,
  });
});

// DELETE hapus produk
app.delete("/:id", (req, res) => {
  const id = req.params.id;
  const data = readData();
  const index = data.findIndex((p) => p.kd_produk === id);

  if (index === -1) {
    return res.status(404).json({ error: "Produk tidak ditemukan" });
  }

  const deleted = data.splice(index, 1);
  writeData(data);

  res.json({
    message: "Produk berhasil dihapus",
    deleted: deleted[0],
  });
});

// WAJIB UNTUK VERCEL
module.exports = app;
