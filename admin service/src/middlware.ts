// middleware/auth.ts
import type { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  playlists: string[];
}

export interface AuthRequest extends Request {
  user?: IUser | null;
}

export const isAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.token as string;

    if (!token) {
      res.status(403).json({
        message: "Please Login",
      });
      return;
    }

     const { data } = await axios.get(`${process.env.User_URL}/api/v1/user/me`, {
      headers: {
        token,
      },
    });


    if (!data ) {
      res.status(401).json({ message: "Invalid user data from auth service" });
      return;
    }

    req.user = data;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(403).json({ message: "Unauthorized, please login now" });
  }
};


