import express from "express";
import mongoose from 'mongoose'

import dotenv from "dotenv";
import userRoutes from "./route.js";
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use("/api/v1", userRoutes);


const connectDB = async () => {
    try{
        
        await mongoose.connect(process.env.MONGO_URI as string , {
            dbName: "spotify-clone"
        });
        console.log("monogdb connected");
    }catch(error){
        console.log(error)
        throw error;
    }
}



app.get("/", (req, res) => {
    res.send("server is running");
})

app.listen(PORT, () => {
    connectDB();
    console.log(`port is running on ${PORT}`);
})







