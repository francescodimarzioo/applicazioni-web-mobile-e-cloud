import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, trim: true },
    amount: { type: Number, required: true },
    paidBy: { type: String, required: true, trim: true },
    participants: { type: [String], default: [] },
    splitAmount: { type: Number, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);
