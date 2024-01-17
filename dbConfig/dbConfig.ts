import mongoose from 'mongoose';

export async function connectDB() {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI!);
    
    connection.connection.on('connected', () => {
        console.log('MongoDB connected successfully');
        });
    connection.connection.on('error', (err) => {
        console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
        process.exit();
    });
    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
