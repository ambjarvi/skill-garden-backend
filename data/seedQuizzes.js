/**
 * Seed quiz questions for plants
 */

const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function seedQuizzes() {
  console.log("🌱 Seeding Quizzes...");

  const quizzes = {
    1: {
      question: "How much sunlight does basil need?",
      options: ["Full sun (6–8 hours)", "Shade", "Low light"],
      answerIndex: 0,
    },
    2: {
      question: "How much water do tomatoes usually need?",
      options: ["Every day", "Consistent deep watering", "Never"],
      answerIndex: 1,
    },
    3: {
      question: "Where does mint grow best?",
      options: ["Full sun and dry soil", "Partial shade and moist soil", "On rocks"],
      answerIndex: 1,
    },
    4: {
      question: "How should rosemary be watered?",
      options: ["Keep soil constantly soaked", "Water only when dry", "Daily misting"],
      answerIndex: 1,
    },
    5: {
      question: "What environment does lavender prefer?",
      options: ["Dry, well-drained soil and sun", "Swamps", "Shade"],
      answerIndex: 0,
    }
  };

  for (const id in quizzes) {
    await db.collection("quizzes").doc(id).set(quizzes[id]);
    console.log(`  ✔ Added quiz for plant ${id}`);
  }

  console.log("🌿 Finished seeding quizzes!");
  process.exit(0);
}

seedQuizzes().catch(console.error);
