/**
 * Seed Firestore with initial plant data
 * Run with:
 *  FIREBASE_SERVICE_ACCOUNT='<paste JSON>' node seed.js
 */

const admin = require("firebase-admin");

// Load service account JSON from env variable
const serviceAccount = require("../serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function seedPlants() {
  console.log("🌱 Seeding Firestore...");

  const plants = [
    {
      id: 1,
      name: "Basil",
      description: "Basil thrives in warm weather and needs 6–8 hours of sunlight daily.",
    },
    {
      id: 2,
      name: "Tomato",
      description: "Tomatoes require full sun, regular watering, and nutrient-rich soil.",
    },
    {
      id: 3,
      name: "Mint",
      description: "Mint grows quickly in partial shade and moist soil. Keep it contained!",
    },
    {
      id: 4,
      name: "Rosemary",
      description: "Rosemary prefers dry soil and full sunlight. Do not overwater.",
    },
    {
      id: 5,
      name: "Lavender",
      description: "Lavender thrives in dry, well-drained soil and plenty of sun.",
    }
  ];

  // Write each plant to Firestore using its id as the doc name
  for (const plant of plants) {
    await db.collection("plants").doc(String(plant.id)).set(plant);
    console.log(`  ✔ Added ${plant.name}`);
  }

  // Create demo user with no unlocked plants
  await db.collection("users").doc("demoUser").set(
    { unlockedPlants: [] },
    { merge: true }
  );

  console.log("\n🌿 Finished seeding Firestore!");
  process.exit(0);
}

seedPlants().catch((err) => {
  console.error("❌ Error seeding Firestore:", err);
  process.exit(1);
});
