const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hilubricant';
  
  try {
    // Attempt standard connection first with a 3-second timeout
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB Connected] Host: ${conn.connection.host} | DB: ${conn.connection.name}`);
    return conn;
  } catch (initialErr) {
    console.warn(`[MongoDB Notice] Could not connect to default URI (${uri}): ${initialErr.message}`);
    console.log('[MongoDB Fallback] Initializing built-in MongoServer instance for local environment...');
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      const memoryUri = mongodInstance.getUri();
      
      const conn = await mongoose.connect(memoryUri);
      console.log(`[MongoDB In-Memory Connected] Connected seamlessly to local instance at ${memoryUri}`);
      return conn;
    } catch (memErr) {
      console.error('[MongoDB Error] Failed to connect to MongoDB and in-memory server:', memErr.message);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};

module.exports = { connectDB, disconnectDB };
