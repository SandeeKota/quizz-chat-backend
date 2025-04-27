import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB, db } from './config/dbConnect';
import config from './config/config';
import routerV1 from './routes/routes-v1';
dotenv.config();

const PORT = config.PORT;
const app = express();

// await connectDB();

mongoose.connect(config.MONGO_URI!)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error connecting to MongoDB:', err));

app.use(express.json());


// V1 Routes
app.use(routerV1);

app.listen(PORT, async () => {
    console.log(` Server running on port http://localhost:${PORT}`)
});

export default app;
