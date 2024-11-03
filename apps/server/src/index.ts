import express from "express";
import { apiRouterV1 } from "./routes/v1";
import { isUserAdmninMiddleware } from "./middlewares/Admin";

const app = express();
app.use(express.json());

app.use("/api/v1", apiRouterV1);

app.post("/", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

app.listen(3000, () => {
  console.log("Server Started at Port 3000");
});
