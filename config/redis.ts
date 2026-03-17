import IORedis, { Redis } from 'ioredis';
import { LogHelpers } from '../app/helpers/LogHelpers';

class RedisConfig {
    private static instance: RedisConfig;
    private client: Redis | null = null;

    private constructor() {}

    public static getInstance(): RedisConfig {
        if (!RedisConfig.instance) {
            RedisConfig.instance = new RedisConfig();
        }
        return RedisConfig.instance;
    }

    public async connect(): Promise<Redis> {
        if (this.client && this.client.status === 'ready') {
            return this.client;
        }

        const isDev = process.env.NODE_ENV === 'DEV';
        
        const host = isDev ? (process.env.REDIS_HOST_DEV || 'localhost') : (process.env.REDIS_HOST_PROD || 'localhost');
        const port = isDev ? 
            parseInt(process.env.REDIS_PORT_DEV || '6379') : 
            parseInt(process.env.REDIS_PORT_PROD || '6379');
        const password = isDev ? process.env.REDIS_PASSWORD_DEV : process.env.REDIS_PASSWORD_PROD;
        const db = isDev ? 
            parseInt(process.env.REDIS_DB_DEV || '0') : 
            parseInt(process.env.REDIS_DB_PROD || '0');

        // Validation des paramètres
        if (isNaN(port) || port < 0 || port > 65535) {
            throw new Error(`Invalid Redis port: ${port}. Port must be between 0 and 65535.`);
        }

        if (isNaN(db) || db < 0 || db > 15) {
            throw new Error(`Invalid Redis database: ${db}. Database must be between 0 and 15.`);
        }

        console.log(`🔧 Redis Client Config - Host: ${host}, Port: ${port}, DB: ${db}`);

        const redisConfig = {
            host,
            port,
            password,
            db,
        };

        this.client = new IORedis({
            host: redisConfig.host,
            port: redisConfig.port,
            password: redisConfig.password,
            db: redisConfig.db,
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
            commandTimeout: 5000,
            lazyConnect: true,
            retryStrategy: (times) => {
                return Math.min(times * 100, 2000);
            }
        });

        this.client.on('error', (err) => {
            console.error('❌ Redis Client Error:', err);
        });

        this.client.on('connect', () => {
            console.log('🔗 Redis Client Connected');
        });

        this.client.on('ready', () => {
            console.log('... Redis Client Ready');
        });

        this.client.on('close', () => {
            console.log('🔌 Redis Client Disconnected');
        });

        await this.client.connect();
        return this.client;
    }

    public async disconnect(): Promise<void> {
        if (this.client && this.client.status === 'ready') {
            await this.client.quit();
            this.client = null;
        }
    }

    public getClient(): Redis | null {
        return this.client;
    }

    public async isConnected(): Promise<boolean> {
        try {
            if (!this.client || this.client.status !== 'ready') {
                return false;
            }
            await this.client.ping();
            return true;
        } catch (error) {
            LogHelpers.showException(error as Error);
            return false;
        }
    }

    // Méthodes utilitaires pour le cache
    public async set(key: string, value: string, ttl?: number): Promise<void> {
        if (!this.client || this.client.status !== 'ready') {
            throw new Error('Redis client not connected');
        }
        
        if (ttl) {
            await this.client.setex(key, ttl, value);
        } else {
            await this.client.set(key, value);
        }
    }

    public async get(key: string): Promise<string | null> {
        if (!this.client || this.client.status !== 'ready') {
            throw new Error('Redis client not connected');
        }
        return await this.client.get(key);
    }

    public async keys(pattern: string): Promise<string[]> {
        if (!this.client || this.client.status !== 'ready') {
            throw new Error('Redis client not connected');
        }
        return await this.client.keys(pattern);
    }

    public async del(key: string): Promise<void> {
        if (!this.client || this.client.status !== 'ready') {
            throw new Error('Redis client not connected');
        }
        await this.client.del(key);
    }

    public async exists(key: string): Promise<boolean> {
        if (!this.client || this.client.status !== 'ready') {
            throw new Error('Redis client not connected');
        }
        const result = await this.client.exists(key);
        return result === 1;
    }
}

export default RedisConfig;
