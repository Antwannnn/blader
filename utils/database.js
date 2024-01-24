import mongoose from "mongoose";

let isConnected = false;

export const connectToDatabase = async () => {
    mongoose.set('strictQuery', true);

    if (isConnected) {
        console.log('Already connected to MongoDB')
        return;
    }

    try {
        mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'blader',
        });

        isConnected = true;
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }

}