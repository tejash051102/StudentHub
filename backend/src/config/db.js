import mongoose from 'mongoose';

let connecting = false;

export async function connectDatabase() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is required');
  }

  if (mongoose.connection.readyState === 1 || connecting) {
    return;
  }

  connecting = true;
  mongoose.set('strictQuery', true);
  mongoose.set('bufferCommands', false);

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS) || 10000
    });
    console.log('MongoDB connected');
  } finally {
    connecting = false;
  }
}

export function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}

export function startDatabaseConnectionLoop() {
  const retryMs = Number(process.env.MONGO_RETRY_MS) || 10000;

  async function attemptConnection() {
    if (isDatabaseConnected() || connecting) {
      return;
    }

    try {
      await connectDatabase();
    } catch (error) {
      console.error(`Database connection failed: ${error.message}`);
      console.log(`Retrying MongoDB connection in ${Math.round(retryMs / 1000)}s...`);
    }
  }

  attemptConnection();
  return setInterval(attemptConnection, retryMs);
}

export function requireDatabase(req, res, next) {
  if (isDatabaseConnected()) {
    return next();
  }

  return res.status(503).json({
    message: 'Database is connecting. Check your MongoDB Atlas network/DNS access and try again shortly.'
  });
}
