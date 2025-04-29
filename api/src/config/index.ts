const appConfig = {
  port: process.env.PORT ?? 3000,
  node_env: process.env.NODE_ENV ?? 'development',
  mongo_url: process.env.MONGO_URL ?? 'mongodb://localhost:27017/mero-photo',
};

export default appConfig;
