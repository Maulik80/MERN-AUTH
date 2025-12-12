 import express from "express"; 
 import cors from "cors";
 import 'dotenv/config';
 import cookieparser from "cookie-parser";
 import ConnectDB from "./config/mongodb.js";
 import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

 const app = express();
 const port =process.env.port||2411
 ConnectDB();



 app.use(express.json());
 app.use(cookieparser());
 
 app.use(cors({origin:'http://localhost:5173',credentials:true}))
// API endpoints
 app.get('/',(req,res)=>res.send("API is Work"));
 app.use('/api/auth',authRoutes);
app.use('/api/user',userRoutes);

 app.listen(port,()=>console.log(`Server Started on Port :${port}`));

  