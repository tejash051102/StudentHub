import 'dotenv/config';
import app from './app.js';
import { startDatabaseConnectionLoop } from './config/db.js';

const port = process.env.PORT || 7000;

app.listen(port, () => {
  console.log(`API running on port ${port}`);
  startDatabaseConnectionLoop();
});
