const express = require("express");
const router = express.Router();
const { getPlants, unlockPlant } = require("../controllers/plantsController");

router.get("/", getPlants);
router.post("/unlock/:id", unlockPlant);

module.exports = router;
