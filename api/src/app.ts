import express from "express"
import dotenv from "dotenv";
import authRouter from "../src/routes/auth.routes"
import passport from "passport";
import cors from "cors";
import { authMiddleware } from "../src/middleware/auth.middleware"
import creatorRouter from "../src/routes/creator.routes"
import publicRouter from "../src/routes/public.routes"
const app = express()

dotenv.config();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json())
app.use(passport.initialize());


// public auth routes 
app.use("/api/auth", authRouter)

app.use(authMiddleware)


// public routes 
app.use("/api/public", publicRouter)
// creator only routes 
app.use("/api/creator", creatorRouter)


app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`)
});


