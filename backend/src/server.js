import 'dotenv/config';
import app from './app.js';
import { startDatabaseConnectionLoop } from './config/db.js';

const port = process.env.PORT || 7000;

const server = app.listen(port, () => {
  console.log(`API running on port ${port}`);
  startDatabaseConnectionLoop();
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Stop the existing backend process or set a different PORT.`);
    process.exit(1);
  }

  console.error('Server failed to start:', error.message);
  process.exit(1);
});
