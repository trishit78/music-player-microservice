import express from 'express';
import dotenv from 'dotenv';
import { sql } from './config/db.js';
import adminRoutes from './route.js';


import { v2 as cloudinary } from "cloudinary";
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME!,
    api_key: process.env.CLOUD_API_KEY!,
    api_secret: process.env.CLOUD_API_SECRET!,   
    secure: true,
});


const app = express();
const PORT = process.env.PORT || 7000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
async function initDB() {
    try {
        await sql`
        CREATE TABLE IF NOT EXISTS albums(
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            descriptions VARCHAR(255) NOT NULL,
            thumbnail  VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;

        await sql`
        CREATE TABLE IF NOT EXISTS songs(
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            descriptions VARCHAR(255) NOT NULL,
            audio  VARCHAR(255) NOT NULL,
            album_id INT REFERENCES albums(id) ON DELETE SET NULL,
            thumbnail  VARCHAR(255) ,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;

        console.log("Table created successfully");
    } catch (error) {
        console.log("Error init DB",error);
    }
}


app.use("/api/v1",adminRoutes);
initDB().then(() => {
app.listen(PORT, () => {
    
  console.log(`Admin service is running on port ${PORT}`);
});
}).catch((err) => {
    console.error("Failed to initialize database:", err);       
    process.exit(1);
});