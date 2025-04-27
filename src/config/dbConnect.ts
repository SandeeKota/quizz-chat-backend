import { MongoClient } from 'mongodb';
import config from './config';

const uri = config.MONGO_URI;

const DatabaseName = "quizz-chat-alpha";

if (!uri) {
    throw new Error('MongoDB URI is not defined');
}

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 20000 });

export async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db(DatabaseName);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        // process.exit(1);
        return null;
    }
}

export const db = client.db(DatabaseName);