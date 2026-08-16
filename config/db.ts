import { Sequelize } from "sequelize-typescript";
import { config } from "./config";

const env = (process.env.NODE_ENV || 'development') as 'development' | 'production';
const DBConfig = config[env];

const sequelizeDB = new Sequelize(
    DBConfig.database as string,
    DBConfig.username as string,
    DBConfig.password as string,
    {
        host: DBConfig.host,
        port: DBConfig.port,
        dialect: DBConfig.dialect as any,
        define: { timestamps: false },
        dialectOptions: DBConfig.dialectOptions,
        timezone: '+01:00',
        logging: false,
        pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
    }
);

export default sequelizeDB;