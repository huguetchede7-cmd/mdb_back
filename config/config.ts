import dotenv from 'dotenv';
dotenv.config();

export const config = {
    development: {
        dialect: process.env.BD_DIALECT_DEV,
        host: process.env.BD_HOST_DEV,
        port: parseInt(process.env.BD_PORT_DEV || '3306'),
        username: process.env.BD_USERNAME_DEV,
        password: process.env.BD_PASSWORD_DEV,
        database: process.env.BD_DATABASE_DEV,
        connectTimeout: process.env.BD_CONNECT_TIMEOUT_DEV,
        charset: process.env.BD_CHARSET_DEV,
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false
            }
        }
    },
    production: {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false
    }
  }
}
};