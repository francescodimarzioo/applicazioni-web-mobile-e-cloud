import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 3001;

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Database connesso");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Errore connessione DB:", err);
    process.exit(1);
  }
}

start();