import express from 'express';
import dotenv from 'dotenv';
import songRoutes from './route.js';
import { createClient } from 'redis';
import cors from 'cors';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());  

export const redisClient = createClient({
    username: 'default',
    password:String(process.env.REDIS_PASSWORD),
    socket: {
        host: 'redis-10325.c241.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 10325
    }
});

await redisClient.connect().then(() => {
    console.log('Connected to Redis');  
}).catch((err) => {
    console.error('Could not connect to Redis', err); 
    process.exit(1);
});




app.use('/api/v1', songRoutes);

app.get('/', (req, res) => {
  res.send('Song Service is running');      
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});