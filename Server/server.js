import express from "express"; 
import cors from "cors";
import 'dotenv/config';
import cookieparser from "cookie-parser";
import ConnectDB from "./config/mongodb.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
// FIX: Use uppercase PORT and default to 2411
const port = process.env.PORT || 2411; 

ConnectDB();

app.use(express.json());
app.use(cookieparser());

// FIX: Allow dynamic origin for deployment
const allowedOrigins = [process.env.CLIENT_URL || 'http://localhost:5173'];
app.use(cors({ origin: allowedOrigins, credentials: true }));

// API endpoints
app.get('/', (req, res) => res.send("API is Working"));
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.listen(port, () => console.log(`Server Started on Port :${port}`));