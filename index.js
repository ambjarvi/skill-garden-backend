const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

// Load service account credentials
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

// Temporary hardcoded user (later you can use auth)
const USER_ID = "demoUser";


// GET /plants → load all plants + unlocked status
app.get("/plants", async (req, res) => {
  try {
    // get plants from Firestore
    const plantSnap = await db.collection("plants").get();
    const plants = plantSnap.docs.map(doc => doc.data());

    // get unlocked plants
    const userRef = db.collection("users").doc(USER_ID);
    const userDoc = await userRef.get();

    const unlocked = userDoc.exists ? userDoc.data().unlockedPlants || [] : [];

    const result = plants.map(plant => ({
      ...plant,
      unlocked: unlocked.includes(plant.id),
    }));

    res.json(result);
  } catch (err) {
    console.error("Error fetching plants:", err);
    res.status(500).json({ error: "Failed to load plants" });
  }
});


// POST /unlock/:id → mark a plant as unlocked
app.post("/unlock/:id", async (req, res) => {
  try {
    const plantId = Number(req.params.id);
    const userRef = db.collection("users").doc(USER_ID);

    await userRef.set(
      {
        unlockedPlants: admin.firestore.FieldValue.arrayUnion(plantId),
      },
      { merge: true }
    );

    res.json({ success: true, plantId });
  } catch (err) {
    console.error("Error unlocking plant:", err);
    res.status(500).json({ error: "Failed to unlock plant" });
  }
});

// GET QUIZ FOR PLANT
app.get("/quiz/:id", async (req, res) => {
  const id = String(req.params.id);
  console.log("➡ Fetching quiz for ID:", id);

  try {
    const quizDoc = await db.collection("quizzes").doc(id).get();

    if (!quizDoc.exists) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.json(quizDoc.data());
  } catch (err) {
    console.error("❌ Error loading quiz:", err);
    res.status(500).json({ error: "Failed to load quiz" });
  }
});

// SUBMIT ANSWER
app.post("/quiz/:id/submit", async (req, res) => {
  const id = String(req.params.id);
  const { answerIndex } = req.body;
  const USER_ID = "demoUser";

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
          unlockedPlants: admin.firestore.FieldValue.arrayUnion(Number(id)),
        },
        { merge: true }
      );
    }

    res.json({ correct: isCorrect });
  } catch (err) {
    console.error("❌ Error submitting quiz:", err);
    res.status(500).json({ error: "Failed to submit quiz" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
