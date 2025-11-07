import mongoose from 'mongoose';
import config from 'config';
import logger from './logger';

const init_db = async () => {
  const conn = await mongoose.connect(config.get('database.uri'));
  logger.info(`Mongodb connected ${conn.connection.name}`);
};

export default init_db;
