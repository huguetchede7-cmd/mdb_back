import { RequestHandler } from 'express';
import { AppointmentsHelpers } from '../helpers/AppointmentsHelpers';

export class AppointmentMiddleware {
    static process: RequestHandler = async (req, res, next) => {
        try {
            // Clean up pending appointments older than 15 minutes
            if (req.path !== '/appointments/confirm') {
                await AppointmentsHelpers.cleanupPendingAppointments();
            }
            next(); // Appeler explicitement next()
        } catch (error) {
            next(error); // Transmettre l'erreur au gestionnaire global
        }
    };
}
