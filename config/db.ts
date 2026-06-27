import { Dialect } from "sequelize";
import { Sequelize } from "sequelize-typescript";

const getDBConfig = () => {
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    return {
      dialect: 'postgres' as Dialect,
      host: url.hostname,
      port: parseInt(url.port),
      username: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      connectTimeout: 30000,
    };
  }

  // Fallback local (développement sans DATABASE_URL)
  return {
    dialect: (process.env.BD_DIALECT_DEV || 'postgres') as Dialect,
    host: process.env.BD_HOST_DEV || 'localhost',
    port: parseInt(process.env.BD_PORT_DEV || '5432'),
    username: process.env.BD_USERNAME_DEV || '',
    password: process.env.BD_PASSWORD_DEV || '',
    database: process.env.BD_DATABASE_DEV || '',
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
    dialectOptions: {          // ← ICI, remplace le dialectOptions existant
      ssl: {
        rejectUnauthorized: false
      },
      family: 4                // ← ajoute cette ligne
    },
    timezone: '+01:00',
    logging: false,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
  }
);

export default sequelizeDB;