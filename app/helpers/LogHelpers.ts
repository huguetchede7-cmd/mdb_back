import { logger } from "../../logger";
    
export const LogHelpers = {
    showException: (error: { stack?: string; message?: string }, force = false) => {
        if (process.env.NODE_ENV === "DEV" || force) {
            logger.error({ error: { stack: error?.stack, message: error?.message } }, 'Exception occurred');
        }
    },
    showInfo: (message: string, data?: Record<string, unknown>) => {
        if (process.env.NODE_ENV === "DEV") {
            logger.info({ data }, message);
        }
    },
    showError: (message: string, data?: Record<string, unknown>) => {
        logger.error({ data }, message);
    }
}