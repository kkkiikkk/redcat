export const serverConfig = () => ({
  port: parseInt(process.env.PORT) ?? 3001,
  nodeEnv: process.env.NODE_ENV,
});
