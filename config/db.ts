import { Dialect } from "sequelize";
import { Sequelize } from "sequelize-typescript";

const getDBConfig = () => {
  return {
    dialect: 'postgres' as Dialect,
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    connectTimeout: 30000,
  };
};

const DBConfig = getDBConfig();

const sequelizeDB = new Sequelize(
  DBConfig.database,
  DBConfig.username,
  DBConfig.password,
  {
    host: DBConfig.host,
    port: DBConfig.port,
    dialect: DBConfig.dialect,
    define: { timestamps: false },
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
      family: 4
    },
    timezone: '+01:00',
    logging: false,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
  }
);

export default sequelizeDB;