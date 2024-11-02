import express from "express";
import { apiRouterV1 } from "./routes/v1";
import prismaClient from "@repo/db/client";

const app = express();
app.listen(express.json());

app.use("/api/v1", apiRouterV1);

app.listen(3000, () => {
  console.log("Server Started at Port 3000");
});
