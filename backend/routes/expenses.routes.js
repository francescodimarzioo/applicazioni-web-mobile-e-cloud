import express from "express";
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense
} from "../controllers/expenses.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, getExpenses);
router.post("/", authMiddleware, createExpense);

router.put("/:id", authMiddleware, updateExpense);
router.delete("/:id", authMiddleware, deleteExpense);

export default router;
