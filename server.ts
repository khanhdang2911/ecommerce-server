import dotenv from "dotenv";
import app from "./src/app";
dotenv.config();
const PORT = process.env.DEV_APP_PORT || 8099;

const server = app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Closing server");
    process.exit(0);
  });
});
