import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
    try {
        const connectionInstant = await mongoose.connect(
            `${process.env.MONGODB_URI as string}/${process.env.DB_NAME as string}`
        );
        console.log(
            '\n MONGODB Connected Successfully!! \n DB HOST :',
            `${connectionInstant.connection.host}`
        );

    } catch (error) {
        if (error instanceof Error) {
            console.log('MONGODB CONNECTION FAILED :', error.message);
            process.exit(1);
        }
        console.log('MONGODB CONNECTION FAILED :', error);
        process.exit(1);
    }
}