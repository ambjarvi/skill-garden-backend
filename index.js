const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// temporary "database"
let plants = [
  { id: 1, name: "Basil", description: "Easy herb", unlocked: false },
  { id: 2, name: "Tomato", description: "Needs sun", unlocked: false },
];

// routes
app.get("/plants", (req, res) => {
  res.json(plants);
});

app.post("/unlock/:id", (req, res) => {
  const id = Number(req.params.id);
  const plant = plants.find(p => p.id === id);
  if (!plant) return res.status(404).json({ error: "Not found" });

  plant.unlocked = true;
  res.json({ message: "Unlocked!", plant });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
