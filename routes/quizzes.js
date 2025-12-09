const express = require("express");
const router = express.Router();
const { getQuiz, submitQuiz } = require("../controllers/quizzesController");

router.get("/:id", getQuiz);
router.post("/:id/submit", submitQuiz);

module.exports = router;
