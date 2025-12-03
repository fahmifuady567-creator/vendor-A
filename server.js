const express = require("express");
const fs = require("fs");

const app = express();

app.get("/vendorA", (req, res) => {
  const data = fs.readFileSync("./data/vendorA.json", "utf8");
  res.json(JSON.parse(data));
});

app.listen(3000, () => {
  console.log("Vendor A berjalan di port 3000");
});
