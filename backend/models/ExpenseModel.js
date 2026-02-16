import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: String,
  amount: Number,
  paidBy: String,
  participants: [String],
  splitAmount: Number
});

export default mongoose.model("Expense", expenseSchema);