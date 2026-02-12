import app from "./app.js";

const PORT = 3001;

app.listen(PORT, () => {
  console.log(console.log("Server avviato su http://localhost:" + PORT));
});