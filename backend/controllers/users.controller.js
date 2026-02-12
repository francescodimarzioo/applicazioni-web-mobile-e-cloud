import { users } from "../data/store.js";
import User from "../models/User.js";
import { v4 as uuid } from "uuid";

export function createUser(req, res) {
  const { name } = req.body;

  const user = new User(uuid(), name);
  users.push(user);

  res.json(user);
}

export function getUsers(req, res) {
  res.json(users);
}