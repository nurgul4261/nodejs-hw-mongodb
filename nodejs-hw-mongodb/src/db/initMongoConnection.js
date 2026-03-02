import mongoose from "mongoose";

const initMongoConnection = async () => {
    try {
        const { 
             MONGODB_USER,
             MONGODB_PASSWORD,
             MONGODB_URL,
             MONGODB_DB,
             MONGODB_OPTIONS 
            } = process.env;

        const mongoDbUrI = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?${MONGODB_OPTIONS}`;
        
        await mongoose.connect(mongoDbUrI);
        console.log("Mongo connection successfully established!");
    }

    catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

export default initMongoConnection;