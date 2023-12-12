import express from 'express';
import {createUser} from '../controllers/userCntlr.js';
const router = express.Router();

router.post("register", createUser)

export {router as userRouteya}