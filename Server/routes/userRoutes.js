import express from 'express'
import UserAuth from '../Middleware/UserAuth.js';
import { getUserData } from '../controllers/UserControllers.js';


const userRoutes = express.Router();

userRoutes.get('/data',UserAuth,getUserData);
export default userRoutes;