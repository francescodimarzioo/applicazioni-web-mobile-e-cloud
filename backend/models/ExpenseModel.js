import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  paidBy: String,
  participants: [String],
});

export default mongoose.model("Expense", expenseSchema);