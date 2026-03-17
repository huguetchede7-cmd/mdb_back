import AppointmentModel from "../../models/AppointmentModel";
import { LogHelpers } from "./LogHelpers";

class DocumentsHelpers {
    static TYPE_APPOINTMENT = 'appointment';
    static TYPE_ORDER = 'order';

    static ALLOW_SOURCES = [
        DocumentsHelpers.TYPE_APPOINTMENT,
        DocumentsHelpers.TYPE_ORDER
    ];

    static async checkSourceAndRef(source : string, sourceRef: string) : Promise<{statut: boolean, message: string}> {
        const result = {statut: false, message: ''};
        try {
            if (!source) {
                throw new Error('Source est requis');
            }

            if (!sourceRef) {
                throw new Error('Référence est requis');
            }

            if (!DocumentsHelpers.ALLOW_SOURCES.includes(source)) {
               throw new Error('Source non autorisée');
            }

            if (source == DocumentsHelpers.TYPE_APPOINTMENT) {
                const appointment = await AppointmentModel.findOne({
                    where: {
                        id: sourceRef
                    }
                });

                if (!appointment) {
                    throw new Error('Rendez-vous non trouvé');
                }
            }

            result.statut = true;
            result.message = 'Source et référence vérifiées avec succès';
            return result;
        } catch (error) {
            LogHelpers.showException(error as Error);
            result.message = (error as Error)?.message ?? 'Erreur lors de la vérification de la source et de la référence';
            return result;
        }


    }
}

export default DocumentsHelpers;    