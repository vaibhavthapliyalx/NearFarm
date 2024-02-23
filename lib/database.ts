import mongoose from 'mongoose';

let connection: any = {};

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    // Use existing database connection
    return;
  }
  try {
    connection = await mongoose.connect(process.env.MONGODB_URI!);
    
    connection.connection.on('connected', () => {
        console.log('MongoDB connected successfully');
        });
    connection.connection.on('error', (err: string) => {
        console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
        process.exit();
    });
    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log(`MongoDB Disconnected`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export async function pingDB() {
  try {
    connectDB();
    console.log(`MongoDB Pinged`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}