import express from "express";
import { createExpense, getExpenses } from "../controllers/expenses.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authMiddleware, createExpense);
router.get("/", authMiddleware, getExpenses);

export default router;
