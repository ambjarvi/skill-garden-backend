const { db, admin } = require("../config/firebase");
const { USER_ID } = require("../utils/constants");

exports.getPlants = async (req, res) => {
  try {
    const plantSnap = await db.collection("plants").get();
    const plants = plantSnap.docs.map(doc => doc.data());

    const userDoc = await db.collection("users").doc(USER_ID).get();
    const unlocked = userDoc.exists ? userDoc.data().unlockedPlants || [] : [];

    const result = plants.map(plant => ({
      ...plant,
      unlocked: unlocked.includes(String(plant.id)),
    }));

    res.json(result);
  } catch (err) {
    console.error("Error fetching plants:", err);
    res.status(500).json({ error: "Failed to load plants" });
  }
};

exports.unlockPlant = async (req, res) => {
  try {
    const plantId = String(req.params.id);

    await db.collection("users").doc(USER_ID).set(
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
};
