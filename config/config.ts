import dotenv from 'dotenv';
dotenv.config();

export const config = {
    development: {
        dialect: process.env.BD_DIALECT_DEV,
        host: process.env.BD_HOST_DEV,
        username: process.env.BD_USERNAME_DEV,
        password: process.env.BD_PASSWORD_DEV,
        database: process.env.BD_DATABASE_DEV,
        connectTimeout: process.env.BD_CONNECT_TIMEOUT_DEV,
        charset: process.env.BD_CHARSET_DEV
    },
    production: {
        dialect: process.env.BD_DIALECT_PROD,
        host: process.env.BD_HOST_PROD,
        username: process.env.BD_USERNAME_PROD,
        password: process.env.BD_PASSWORD_PROD,
        database: process.env.BD_DATABASE_PROD,
        connectTimeout: process.env.BD_CONNECT_TIMEOUT_PROD,
        charset: process.env.BD_CHARSET_PROD
    }
};
