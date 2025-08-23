import express from "express";
import { loginUser, registerUser } from "./controller.js";
import { isAuth, myProfile } from "./middleware.js";

const router = express.Router();


router.post("/user/register", registerUser);
router.post("/user/login", loginUser);
router.post("/user/me",isAuth,myProfile);

export default router;