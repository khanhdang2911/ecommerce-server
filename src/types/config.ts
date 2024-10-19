type AppConfig = {
  app: {
    port: number | string;
  };
  db: {
    host: string;
    port: number | string;
    name: string;
  };
};
export { AppConfig };
