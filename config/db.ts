import { Dialect } from "sequelize";
import { Sequelize } from "sequelize-typescript";

const NODE_ENV = process.env.NODE_ENV === "test" ? "DEV" : 
                 process.env.NODE_ENV === "production" ? "PROD" : 
                 (process.env.NODE_ENV || "DEV");

const getDBConfig = () => {
    // Si DATABASE_URL existe, l'utiliser directement
    if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    return {
        dialect: 'mysql' as Dialect,
        host: url.hostname,
        port: parseInt(url.port),
        username: url.username,
        password: url.password,
        database: url.pathname.slice(1),
        connectTimeout: 30000,
        charset: 'utf8mb4',
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false
            }
        }
    };
}

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