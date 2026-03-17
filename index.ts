/* eslint-disable @typescript-eslint/no-unused-vars  */
import 'dotenv/config';

import './instrument'; // Sentry Initialisation
import express, { NextFunction, Request, Response } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import helmet from 'helmet'
import ApiHelpers from './app/helpers/apiHelpers'
import sequelizeDB from './config/db'
import adminRoutes from './app/routes/adminRoutes'
import { CheckAuthAdminMiddleware } from './app/middleware/CheckAuthAdminMiddleware'
import path from 'path'
import { AdminLogMiddleware } from './app/middleware/AdminLogMiddleware'
import { LogHelpers } from './app/helpers/LogHelpers';
import * as Sentry from "@sentry/node";

const app = express()
const port = process.env.PORT || 3001
const responseJson = { ...ApiHelpers.DEFAULT_RESPONSE_JSON }

/********************************************************
 * 📁 Middleware pour les fichiers statics
 *******************************************************/
app.use('/assets', express.static(__dirname + '/assets'))

// Permet la lecture publique de tous les fichiers/ressources du dossier /public via /public/*
app.use('/public', express.static(path.join(__dirname, 'public')))

/********************************************************
 * 🚩 Initailisation
 *******************************************************/
// Using Helmet
if (process.env.NODE_ENV != 'DEV') {
  app.use(helmet())
}

// Utiliser express-fileupload pour les request de type form Data
app.use(fileUpload())

// To allow request body data
app.use(express.urlencoded({ extended: true })) // Permet de parser les données x-www-form-urlencoded

// Always output in JSON format
app.use(express.json())

// Prevnt cors error problem
app.use(cors())

// Use morgan in development mode
if (process.env.NODE_ENV === 'DEV') {
  app.use(morgan('dev'))
}

/********************************************************
 * 📙 Database Connexion
 *******************************************************/
// Test the database connection
sequelizeDB
  .authenticate()
  .then(async () => {
    if (process.env.NODE_ENV == 'DEV') {
      console.log('Database connected...')
    }
  })
  .catch(err => console.log('Error: ' + err))

/********************************************************
 * 🔴 Redis Connexion
 *******************************************************/
// Test the Redis connection
/*const redisInstance = RedisConfig.getInstance()
redisInstance.connect()
  .then(async () => {
    // Test Redis avec un console.log
    const isConnected = await redisInstance.isConnected()
    console.log(isConnected ? '✅ Redis Connected' : '❌ Redis Disconnected')
  })
  .catch(err => {
    console.error('🔴 Redis Error:', err)
  })*/

/********************************************************
 * 📧 BullMQ Email Worker
 *******************************************************/
// Initialiser le worker BullMQ pour les emails
/*queuePromise.then(() => {
  console.log('📧 BullMQ Email Worker initialized successfully')
}).catch((err) => {
  console.error('📧 Email Worker Error:', err)
})*/

/********************************************************
 * 🚧 Middlerware & Routes
 *******************************************************/

// Middleware d'authentification appliqué aux comptes Client
/*app.use('/manager/app', CheckAuthClientMiddleware.process)
app.use('/manager', clientRoutes)*/

app.use('/admin/app', CheckAuthAdminMiddleware.process)
app.use('/admin/', AdminLogMiddleware.process)
app.use('/admin', adminRoutes)

//Routes pour les utilisateurs non connectés
//app.use('/util', utilRoutes)


/********************************************************
 * ⚠️ Handle Error
 *******************************************************/
// The error handler must be registered before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (process.env.DEBUG_MODE == 'true') {
    console.error(err.stack)
    responseJson.message = err.stack as string
  }
  res.status(500).json(responseJson)
})

// Middleware for handling 404 errors
app.use((req, res) => {
  responseJson.message = "Endpoint introuvable. Vérifier bien l'url"
  res.status(404).json(responseJson)
})

/********************************************************
 * 🚀 Starting project
 ********************************************************/
app.listen(port, () => {
  if (process.env.NODE_ENV == 'DEV') {
    console.log(`API start on !!!`, 'Url: ' + process.env.BASE_URL)
  }
})

process.on("uncaughtException", async (err) => {
  Sentry.captureException(err);
  LogHelpers.showException(err as Error);
  await Sentry.close(2000);
  process.exit(1);
});

process.on("unhandledRejection", async (reason) => {
  Sentry.captureException(reason);
  LogHelpers.showException(reason as Error);
  await Sentry.close(2000);
  process.exit(1);
});

module.exports = app
