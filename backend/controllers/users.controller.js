import User from "../models/UserModel.js";

// GET tutti gli utenti
export async function getUsers(req, res) {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero utenti" });
  }
}

// POST crea nuovo utente
export async function createUser(req, res) {
  try {
    const { name } = req.body;

    const user = new User({ name });
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Errore nel salvataggio utente" });
  }
}