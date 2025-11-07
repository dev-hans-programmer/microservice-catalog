import app from './app';
import init_db from './config/db';
import logger from './config/logger';

import config from 'config';

const startServer = async () => {
  try {
    const port = parseInt(config.get('server.port') || '0');
    await init_db();
    app.listen(port, () => logger.info(`Server running on ${port}`));
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};
void startServer();
