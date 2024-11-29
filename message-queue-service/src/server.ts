import express from "express";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res, next) => {
  res.send("Hello World");
});

app.listen(8199, () => {
  console.log("Server is running on port 8199");
});
