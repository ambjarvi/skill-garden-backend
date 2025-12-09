const { db, admin } = require("../config/firebase");
const { USER_ID } = require("../utils/constants");

exports.getQuiz = async (req, res) => {
  const id = String(req.params.id);

  try {
    const quizDoc = await db.collection("quizzes").doc(id).get();

    if (!quizDoc.exists) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.json(quizDoc.data());
  } catch (err) {
    console.error("Error loading quiz:", err);
    res.status(500).json({ error: "Failed to load quiz" });
  }
};

exports.submitQuiz = async (req, res) => {
  const id = String(req.params.id);
  const { answerIndex } = req.body;

  try {
    const quizDoc = await db.collection("quizzes").doc(id).get();

    if (!quizDoc.exists) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    const quiz = quizDoc.data();
    const isCorrect = quiz.answerIndex === answerIndex;

    if (isCorrect) {
      await db.collection("users").doc(USER_ID).set(
        {
          unlockedPlants: admin.firestore.FieldValue.arrayUnion(id),
        },
        { merge: true }
      );
    }

    res.json({ correct: isCorrect });
  } catch (err) {
    console.error("Error submitting quiz:", err);
    res.status(500).json({ error: "Failed to submit quiz" });
  }
};
