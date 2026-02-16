import User from "../models/UserModel.js";

export async function getUsers(req, res) {
  try {
    const users = await User.find({}).select("_id name email"); // niente passwordHash
    res.json(users);
  } catch {
    res.status(500).json({ error: "Errore nel recupero utenti" });
  }
}