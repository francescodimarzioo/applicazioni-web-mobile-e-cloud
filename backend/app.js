import "dotenv/config";
import express from "express";
import cors from "cors";
import usersRoutes from "./routes/users.routes.js";
import expensesRoutes from "./routes/expenses.routes.js";
import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Database connesso"))
  .catch(err => console.error("❌ Errore DB:", err));


const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", usersRoutes);
app.use("/expenses", expensesRoutes);

export default app;