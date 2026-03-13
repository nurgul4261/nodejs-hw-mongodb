import mongoose from "mongoose";
import { env } from '../utils/env.js';

const initMongoConnection = async () => {
    try {
        const MONGODB_USER     = env('MONGODB_USER');
        const MONGODB_PASSWORD = env('MONGODB_PASSWORD');
        const MONGODB_URL      = env('MONGODB_URL');
        const MONGODB_DB       = env('MONGODB_DB');
        const MONGODB_OPTIONS  = env('MONGODB_OPTIONS', '');

        const mongoDbUri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?${MONGODB_OPTIONS}`;
        
        await mongoose.connect(mongoDbUri);
        console.log("Mongo connection successfully established!");
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

export default initMongoConnection;