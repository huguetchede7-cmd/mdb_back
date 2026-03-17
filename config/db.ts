import { Dialect } from "sequelize";
import { Sequelize } from "sequelize-typescript";

const NODE_ENV = process.env.NODE_ENV === "test" ? "DEV" : (process.env.NODE_ENV || "DEV");

// Validation et configuration de la base de données avec valeurs par défaut
const getDBConfig = () => {
    const isDev = NODE_ENV == 'DEV';
    const host = process.env[`BD_HOST_${NODE_ENV}`] || (isDev ? 'localhost' : '');
    const username = process.env[`BD_USERNAME_${NODE_ENV}`] || (isDev ? 'root' : '');
    const password = process.env[`BD_PASSWORD_${NODE_ENV}`] || '';
    const database = process.env[`BD_DATABASE_${NODE_ENV}`];
    const charset = process.env[`BD_CHARSET_${NODE_ENV}`] || 'utf8mb4';
    const connectTimeout = parseInt(process.env[`BD_CONNECT_TIMEOUT_${NODE_ENV}`] || '60000');

    // Validation des paramètres critiques
    if (!host) {
        throw new Error(`Database host is required for environment: ${NODE_ENV}`);
    }
    if (!username) {
        throw new Error(`Database username is required for environment: ${NODE_ENV}`);
    }
    if (!database) {
        throw new Error(`Database name is required for environment: ${NODE_ENV}`);
    }

    return {
        dialect: 'mysql' as Dialect,
        host,
        username,
        password,
        database,
        connectTimeout,
        charset
    };
};

const DBConfig = getDBConfig();

const sequelizeDB = new Sequelize(DBConfig.database, DBConfig.username, DBConfig.password, {
    host: DBConfig.host,
    dialect: DBConfig.dialect,
    define: {
        timestamps: false
    },
    dialectOptions: {
        charset: DBConfig.charset,
        dateStrings: true,
        typeCast: true,
    },
    timezone: '+01:00',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

export default sequelizeDB;