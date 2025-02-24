import express from "express";
import userRouter from "./routes/userRoutes";
import RoomsRouter from "./routes/roomsRoutes";
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cors());

app.use("/user",userRouter);
app.use("/rooms",RoomsRouter);

app.listen(3001);