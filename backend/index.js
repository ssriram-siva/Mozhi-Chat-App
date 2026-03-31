import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import { app,server } from "./lib/socket.js";
import express from "express";
import path from "path";

dotenv.config();






const PORT = process.env.PORT;
const _dirname = path.resolve();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// ✅ 2. BODY PARSER WITH LIMIT
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ✅ 3. COOKIE PARSER
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);

if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname,"../frontend/dist")));
  app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,".../frontend","dist","index.html"));
  })
}

server.listen(PORT,()=>{
    console.log("Server is Connected at PORT : ",PORT)
    connectDB();
})