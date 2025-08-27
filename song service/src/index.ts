import express from 'express';
import dotenv from 'dotenv';
import songRoutes from './route.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.use('/api/v1', songRoutes);

app.get('/', (req, res) => {
  res.send('Song Service is running');      
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});