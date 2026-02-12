import express from "express";
import cors from "cors";
import usersRoutes from "./routes/users.routes.js";
import expensesRoutes from "./routes/expenses.routes.js";
import mongoose from "mongoose";

mongoose.connect("LA_TUA_MONGODB_URI_HERE", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("DB Connesso"))
.catch(err => console.error("Errore DB:", err));
const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", usersRoutes);
app.use("/expenses", expensesRoutes);

export default app;

