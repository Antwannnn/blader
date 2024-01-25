import mongoose from "mongoose";

export const connectToDatabase = async () => {

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'blader_db',
        });
        console.log("Connected to MongoDB")
    } catch (error) {
        console.log(error);
    }

}