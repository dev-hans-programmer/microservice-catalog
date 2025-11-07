import app from './app';
import logger from './config/logger';

import config from 'config';

const startServer = () => {
  try {
    const port = parseInt(config.get('server.port') || '0');
    app.listen(port, () => logger.info(`Server running on ${port}`));
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};
startServer();
