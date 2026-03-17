import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { LogHelpers } from '../app/helpers/LogHelpers';
import { EmailHelpers } from '../app/helpers/EmailHelpers';

// Configuration Redis dédiée pour BullMQ
const createRedisConnection = () => {
    // Configuration par défaut pour le développement
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

    console.log(`🔧 Redis Config - Host: ${host}, Port: ${port}, DB: ${db}`);

    return new IORedis({
        host,
        port,
        password,
        db,
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        commandTimeout: 30000, // 30 secondes pour les opérations BullMQ
        lazyConnect: true,
        retryStrategy: (times) => {
            return Math.min(times * 100, 3000);
        },
        keepAlive: 30000,
        family: 4,
        connectTimeout: 10000,
    });
};

// Configuration des queues - Initialisation différée
let emailQueue: Queue;
let emailWorker: Worker;

const initializeQueue = async () => {
    const redisConnection = createRedisConnection();
    
    // Configuration de la connexion Redis
    redisConnection.on('connect', () => {
        console.log('🔗 BullMQ Redis Connected');
    });

    redisConnection.on('ready', () => {
        console.log('✅ BullMQ Redis Ready');
    });

    redisConnection.on('error', (err) => {
        console.error('❌ BullMQ Redis Error:', err);
    });

    redisConnection.on('close', () => {
        console.log('🔌 BullMQ Redis Disconnected');
    });

    // Attendre que Redis soit prêt
    await redisConnection.connect();
    
    emailQueue = new Queue('email-queue', {
        connection: redisConnection,
        defaultJobOptions: {
            removeOnComplete: 100, // Garder 100 jobs terminés
            removeOnFail: 50, // Garder 50 jobs échoués
            attempts: 3, // 3 tentatives maximum
            backoff: {
                type: 'exponential',
                delay: 2000, // Délai initial de 2 secondes
            },
        },
    });

    // Configuration du worker
    emailWorker = new Worker('email-queue', async (job) => {
        const { data } = job.data;
        
        try {

            // Send mail to client
            const mailOptions = {
                to: data.email,
                mailRef: data.emailData.mailRef,
                subject: data.object,
                data: data.emailData,
                html: EmailHelpers.buildContent(data.emailData),
            };

            // // Envoi de l'email
            await EmailHelpers.send(mailOptions);
        } catch (error) {
            LogHelpers.showException(error as Error);
            throw error; // Re-throw pour que BullMQ gère la retry
        }
    }, {
        connection: redisConnection,
        concurrency: 5, // Traiter 5 emails en parallèle
    });
    
    return { emailQueue, emailWorker };
};

// Initialiser la queue
const queuePromise = initializeQueue();

// Event listeners pour le worker - Configuration différée
queuePromise.then(({ emailWorker }) => {
    // emailWorker.on('completed', (job) => {
      
    // });

    // emailWorker.on('failed', (job, err) => {
    // });

    emailWorker.on('error', (err) => {
        console.log('📧 Email Worker Error:', err);
    });
    
    console.log('📧 Email Worker Ready - Processing emails in background');
}).catch((error) => {
    console.error('❌ Failed to initialize email worker:', error);
});

// Fonction pour ajouter un job à la queue
export async function addEmailJob(
  type: string,
  data: {
    email: string;
    object: string;
    emailData: {
      mailRef: string;
      mailType: string;
      [key: string]: unknown;
    };
  },
  options?: {
    delay?: number;
    [key: string]: unknown;
  }
) {
    try {
        // Attendre que la queue soit initialisée
        const { emailQueue } = await queuePromise;
        const job = await emailQueue.add(type, { type, data }, {
            ...options,
            delay: options?.delay || 0, // Délai en millisecondes
        });
        return job;
    } catch (error) {
        LogHelpers.showException(error as Error);
        throw error;
    }
}

// Fonction pour nettoyer la queue
export async function cleanQueue() {
    try {
        const { emailQueue } = await queuePromise;
        await emailQueue.clean(24 * 60 * 60 * 1000, 100, 'completed'); // Nettoyer les jobs terminés de plus de 24h
        await emailQueue.clean(7 * 24 * 60 * 60 * 1000, 50, 'failed'); // Nettoyer les jobs échoués de plus de 7 jours
        LogHelpers.showInfo('Queue cleaned successfully');
    } catch (error) {
        LogHelpers.showException(error as Error);
    }
}

// Fonction pour obtenir la queue et le worker
export const getEmailQueue = async () => {
    const { emailQueue } = await queuePromise;
    return emailQueue;
};

export const getEmailWorker = async () => {
    const { emailWorker } = await queuePromise;
    return emailWorker;
};

// Export the promise that resolves to the queue and worker
export default queuePromise;
