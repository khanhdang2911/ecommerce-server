import dotenv from "dotenv";
import app from "./src/app";
dotenv.config();
const PORT = process.env.PORT || 8099;

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});

process.on("SIGINT", () => {
  console.log("Closing server");
});
