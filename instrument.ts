import * as Sentry from "@sentry/node";

/********************************************************
 *  Sentry Initialisation
 *******************************************************/
Sentry.init({
    environment: process.env.NODE_ENV,
    dsn: process.env.SENTRY_DSN,
    enableLogs: true,
    sendDefaultPii: true,
});