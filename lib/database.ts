import * as db from "mssql";

const config = {
  server: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: process.env.DB_ENCRYPT,
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE,
  },
};

const connectionString = `Server=${config.server},${config.port};Database=${config.database};User Id=${config.user};Password=${config.password};Encrypt=${config.options.encrypt};trustServerCertificate=${config.options.trustServerCertificate}`;

export const database = new db.ConnectionPool(connectionString);

database
  .connect()
  .then(() => console.log("Database connected successfully"))
  .catch((error) => console.error("Database connection failed:", error));
