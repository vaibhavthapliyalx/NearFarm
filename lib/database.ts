/**
 * @fileoverview This file contains the database connection functions.
 */
// Importing the mongoose library
import mongoose from 'mongoose';

let connection: any = {};

// Function to connect to the database
export async function connectDB() {
  // If there is an existing database connection, use it instead of creating a new one.
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

// Function to disconnect from the database
export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log(`MongoDB Disconnected`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Function to ping the database.
export async function pingDB() {
  try {
    connectDB();
    console.log(`MongoDB Pinged`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}