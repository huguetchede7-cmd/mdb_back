import AppointmentModel from "../../models/AppointmentModel";
import AppointmentTrashModel from "../../models/AppointmentTrashModel";
import ServiceModel from "../../models/ServiceModel";
import ShopModel from "../../models/ShopModel";
import ShopServiceModel from "../../models/ShopServiceModel";
import TransactionModel from "../../models/TransactionModel";
import UserDocumentModel from "../../models/UserDocumentModel";
import UserModel from "../../models/UserModel";
import GeneralSettingModel from "../../models/GeneralSettingModel";
import RedisConfig from "../../config/redis";
import { QueryTypes } from "sequelize";
import { Status } from "../constants/status";
import sequelizeDB from "../../config/db";
import { Op } from "sequelize";
import { LogHelpers } from "./LogHelpers";
import DocumentsHelpers from "./DocumentsHelpers";

export class AppointmentsHelpers {

    static SERVICE_HYDRAVUE = 10;
    static SERVICE_OPTOMETRY_CONSULTATION = 9;

    static async format(appointment: AppointmentModel): Promise<{
        appointment: AppointmentModel,
        store: ShopModel,
        service: ServiceModel,
        validatedBy: UserModel | null,
        canceledBy: UserModel | null,
        user: UserModel,
        transaction: TransactionModel,
        documents: UserDocumentModel[] | null } | null>  {
        try {
            const appointmentDetail = appointment.get();

            // get store
            const store = await ShopModel.findByPk(appointmentDetail.shop_id);
            
            // get service
            const service = await ServiceModel.findByPk(appointmentDetail.service_id);
            
            // get user
            const user = await UserModel.findByPk(appointmentDetail.user_id);
            
            // get transaction
            const transaction = await TransactionModel.findOne({ where: { linked_reference: appointmentDetail.reference } });

            // get validated by
            let validatedBy = null;
            if (appointmentDetail?.validated_by) {
                validatedBy = await UserModel.findByPk(appointmentDetail.validated_by);
            }

            // get canceled by
            let canceledBy = null;
            if (appointmentDetail?.canceled_by) {
                canceledBy = await UserModel.findByPk(appointmentDetail.canceled_by);
            }
            
            // get documents
            const documents = await UserDocumentModel.findAll({ where: { 
                intended_for: appointmentDetail.user_id,
                source: DocumentsHelpers.TYPE_APPOINTMENT,
                source_ref: appointmentDetail.id
            } });
            
            return {
                appointment: appointment.get() as AppointmentModel,
                store: store?.get() as ShopModel,
                service: service?.get() as ServiceModel,
                user: user?.get() as UserModel,
                transaction: transaction?.get() as TransactionModel,
                validatedBy: validatedBy?.get() as UserModel,
                canceledBy: canceledBy?.get() as UserModel,
                documents: documents.length ? documents.map(doc => doc.get()) as UserDocumentModel[] : null,
            }
        } catch (error) {
            console.error("Error retrieving coordinates:", (error as Error).message);
            return null;
        }
    }


    static formatRedisKey(storeId: number, serviceId: number, date: string): string {
        return `appointment_${storeId}_${serviceId}_${date.replaceAll(' ', '')}`;
    }



    static async validateStore(storeId: number): Promise<{statut: boolean, message: string}> {
        const result = { statut: true, message: "" }
        try {
            const store = await ShopModel.findByPk(storeId);
            if (!store) {
                throw new Error('Le magasin selectionné n\'est pas valide');
            }
            return result
        } catch (error) {
            result.statut = false;
            result.message = (error as Error).message;
            return result;
        }
    }


    /**
     * Valide si un service est disponible dans un magasin donné
     * @param storeId - L'identifiant du magasin à vérifier
     * @param serviceId - L'identifiant du service à vérifier
     * @returns Un objet contenant le statut de validation et un message d'erreur éventuel
     */
    static async validateService(storeId: number, serviceId: number): Promise<{statut: boolean, message: string}> {
        const result = { statut: true, message: "" }
        try {
            const service = await ShopServiceModel.findOne({ 
                where: { shop_id: storeId, service_id: serviceId } 
            });
            if (!service) {
                throw new Error('Le service selectionné n\'est pas valide pour ce magasin');
            }
            return result;
        } catch (error) {
            result.statut = false;
            result.message = (error as Error).message;
            return result;
        }
    }



    /**
     * Vérifie si un rendez-vous est pris suffisamment à l'avance (minimum 1 heure)
     * @param appointmentDate - La date et l'heure du rendez-vous à vérifier
     * @param minimumMinutesAdvance - Le nombre de minute minimum avant la date du rendez-vous
     * @returns Un objet contenant le statut de validation et un message d'erreur éventuel
     */
    static validateMinimumTimeAdvance(appointmentDate: Date, minimumMinutesAdvance: number = 60): {statut: boolean, message: string} {
        const result = { statut: true, message: "" }
        try {
            const now = new Date();
            const minTime = new Date(now.getTime() + (minimumMinutesAdvance * 60 * 1000)); // 1 hour from now

            if (appointmentDate < minTime) {
                throw new Error(`Le rendez-vous doit être pris au minimum ${minimumMinutesAdvance} minutes à l'avance`);
            }
            return result;
        } catch (error) {
            result.statut = false;
            result.message = (error as Error).message;
            return result;
        }
    }



    /**
     * Vérifie si un rendez-vous peut être pris le dimanche
     * @param appointmentDate - La date du rendez-vous à vérifier
     * @param allowSunday - Indique si les rendez-vous sont autorisés le dimanche
     * @returns Un objet contenant le statut de validation et un message d'erreur éventuel
     */
    static validateSunday(appointmentDate: Date, allowSunday: boolean): {statut: boolean, message: string} {
        const result = { statut: true, message: "" }
        try {
            if (!allowSunday && appointmentDate.getDay() === 0) {
                throw new Error('Les rendez-vous ne sont pas disponibles le dimanche');
            }
            return result;
        } catch (error) {
            result.statut = false;
            result.message = (error as Error).message;
            return result;
        }
    }



    /**
     * Vérifie si un rendez-vous peut être pris un jour férié
     * @param appointmentDate - La date du rendez-vous à vérifier
     * @param allowHolidays - Indique si les rendez-vous sont autorisés les jours fériés
     * @returns Un objet contenant le statut de validation et un message d'erreur éventuel
     */
    static async validateHoliday(appointmentDate: Date, allowHolidays: boolean): Promise<{statut: boolean, message: string}> {
        const result = { statut: true, message: "" }
        try {
            if (allowHolidays) {
                return result;
            }

            const month = appointmentDate.getMonth() + 1;
            const day = appointmentDate.getDate();
            const appointmentMonthDay = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

            const holidays = await GeneralSettingModel.findOne({ where: { label: 'PUBLIC_HOLIDAYS' } });
            const holidaysArray = holidays ? JSON.parse(holidays.get('value') as string) : [];
            
            // Convert holidaysArray dates to MM-DD format for comparison
            const universalHolidays = holidaysArray.map((holiday: {date: string}) => {
                const [, month, day] = holiday.date.split('-');
                return `${month}-${day}`;
            });

            if (universalHolidays.includes(appointmentMonthDay)) {
                throw new Error('Les rendez-vous ne sont pas disponibles les jours fériés');
            }
            return result;
        } catch (error) {
            result.statut = false;
            result.message = (error as Error).message;
            return result;
        }
    }





    /**
     * Récupère tous les créneaux disponibles et pris pour un service, une boutique et une date donnée
     * @param serviceId - L'identifiant du service
     * @param storeId - L'identifiant du magasin 
     * @param date - La date au format yyyy-mm-dd
     * @param userId - L'identifiant de l'utilisateur
     * @returns Un objet contenant tous les créneaux possibles et pris
     */
    static async getTimeSlots(dataOptions :{serviceId: number, storeId: number, dateTime: string, userId: number}): Promise<{
        allAllowedTimeSlots: string[],
        dbTakenSlots: string[],
        redisTakenSlots: string[],
        availableSlots: string[],
        isFree: boolean
    }> {
        try {
            const {serviceId, storeId, dateTime, userId} = dataOptions;
            const date = new Date(dateTime).toISOString().split('T')[0];
            const timeSlot = dateTime.split(' ')[1];

            // get day of the week
            const dayOfWeek = new Date(dateTime).getDay();
            const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
            const dayofTheWeek = days[dayOfWeek];

            // Récupérer tous les créneaux possibles pour ce service
            let targetCrenauTag = serviceId == AppointmentsHelpers.SERVICE_HYDRAVUE  ? 'UNIVERSAL_CREANAU_HYDRAVUE'  : 'UNIVERSAL_CREANAU_OPTOMETRY_CONSULTATION';
            targetCrenauTag = `${targetCrenauTag}_${dayofTheWeek}`;
            const universalCreanaux = await GeneralSettingModel.findOne({ where: { label: targetCrenauTag } });
            const allAllowedTimeSlots = universalCreanaux ? JSON.parse(universalCreanaux.get('value') as string) : [];
            
            // Récupérer les créneaux pris en base de données
            const dbAppointments = await sequelizeDB.query<{start_time: string}[] | []>(
                `SELECT start_time FROM appointments 
                WHERE shop_id = :storeId
                AND service_id = :serviceId 
                AND status != :cancelledStatus
                AND start_time LIKE :datePattern
                AND deleted_at IS NULL`,
                {
                    replacements: {
                        storeId: storeId,
                        serviceId: serviceId,
                        cancelledStatus: Status.APPOINTMENT_CANCELLED,
                        datePattern: `${date}%`
                    },
                    type: QueryTypes.SELECT
                }
            );
            const dbTakenSlots = dbAppointments.map((apt) => {
                if ('start_time' in apt) {
                    const startTime = apt.start_time as string;
                    return startTime.split(' ')[1]; // Extraire seulement hh:mm:ss
                }
                return '';
            }).filter((slot) => slot !== '');

            // Récupérer les créneaux temporaires de Redis
            const redis = RedisConfig.getInstance();
            const pattern = `appointment_${storeId}_${serviceId}_${date.replaceAll(' ', '')}*`;
            const redisKeys = await redis.keys(pattern); // Get all matching keys
            const redisTakenSlots = [];
            let redisTakenSlotsToTargetDateUserId = "";
            let isSlotTakenInRedisByAnotherUser = false; // Vérifier dans Redis si le créneau est déjà réservé par quelqu'un d'autre

            if (redisKeys.length) {
                for (const key of redisKeys) {
                    // Get the user id for the target date
                    if (key.startsWith(AppointmentsHelpers.formatRedisKey(storeId, serviceId, date))) {
                        redisTakenSlotsToTargetDateUserId = await redis.get(key) as string;
                        if (redisTakenSlotsToTargetDateUserId != userId.toString()) {
                            redisTakenSlots.push(key.slice(-8));
                            isSlotTakenInRedisByAnotherUser = true;
                        } else {
                            isSlotTakenInRedisByAnotherUser = false; // Le créneau est réservé par l'utilisateur courant
                        }
                    } else {
                        redisTakenSlots.push(key.slice(-8));
                    }
                }
            }

            // Calculer les créneaux disponibles
            const allTakenSlots = [...dbTakenSlots, ...redisTakenSlots];
            let availableSlots = allAllowedTimeSlots.filter((slot: string) => !allTakenSlots.includes(slot));

            // Remove time slot lower than current hour IF TARGET DATE IS TODAY
            if (availableSlots.length) {
                const currentDate = new Date();
                const targetDate = new Date(date);
                
                // Only filter slots if target date is today
                if (targetDate.toDateString() == currentDate.toDateString()) {
                    const currentHour = currentDate.getHours() + 1;
                    availableSlots = availableSlots.filter((slot: string) => {
                        const [hours] = slot.split(':').map(Number);
                        return hours > currentHour;
                    });
                }
            }


            // Vérifier si la date en paramètre est libre
            // Un créneau n'est pas libre s'il est pris en DB
            const isSlotTakenInDb = dbTakenSlots.includes(timeSlot);
            
            // Verifier si le crenaux est acceptable pôur le serivce et la boutique selectionnés
            const slotsAcceptable = await allAllowedTimeSlots.find((slot: string) => slot == timeSlot);
            const isSlotAcceptable = !!slotsAcceptable;            
            
            const isFree = !isSlotTakenInDb && !isSlotTakenInRedisByAnotherUser && isSlotAcceptable;

            availableSlots = availableSlots.length ? availableSlots.sort((a: string, b: string) => a.localeCompare(b)) : [];

            return {
                allAllowedTimeSlots,
                dbTakenSlots,
                redisTakenSlots,
                availableSlots,
                isFree
            };

        } catch (error) {
            console.error("Erreur lors de la récupération des créneaux:", (error as Error).message);
            return {
                allAllowedTimeSlots: [],
                dbTakenSlots: [],
                redisTakenSlots: [],
                availableSlots: [],
                isFree: false
            };
        }
    }
    

    static async validateCreneauHoraire(data: { store: number, service: number, start_time: string, userId: number }, options: {
        timeAllowSunday?: boolean,
        timeAllowHolidays?: boolean,
    }): Promise<{ statut: boolean, message: string, data: null }> {
        const result = { statut: false, message: '', data: null };
        const fullOptions = {
            timeAllowSunday: options?.timeAllowSunday ?? false,
            timeAllowHolidays: options?.timeAllowHolidays ?? false,
        };

        try {
            // Vérifier si le magasin existe
            const store = await ShopModel.findByPk(data.store);
            if (!store) {
                return { ...result, message: 'Le magasin selectionné n\'est pas disponible pour le rendez-vous' };
            }

            // Vérifier si le service existe et est disponible dans ce magasin
            const shopService = await ShopServiceModel.findOne({
                where: {
                    shop_id: data.store,
                    service_id: data.service,
                }
            });
            if (!shopService) {
                return { ...result, message: 'Le service selectionné n\'est pas disponible dans ce magasin pour le rendez-vous' };
            }

            const appointmentDate = new Date(data.start_time);
            const now = new Date();

            // Vérifier le délai minimum
            const minTimeAdvance = await GeneralSettingModel.findOne({ where: { label: 'MIN_TIME_ADVANCE_MINUTES' } });
            const minMinutes = minTimeAdvance ? parseInt(minTimeAdvance.get('value') as string) : 60;
            if ((appointmentDate.getTime() - now.getTime()) < (minMinutes * 60 * 1000)) {
                return { ...result, message: `Le rendez-vous doit être pris au moins ${minMinutes} minutes à l'avance` };
            }

            // Vérifier si c'est un dimanche
            if (!fullOptions.timeAllowSunday && appointmentDate.getDay() === 0) {
                return { ...result, message: 'Les rendez-vous ne sont pas possibles le dimanche' };
            }

            // Vérifier si c'est un jour férié
            const holidayValidation = await AppointmentsHelpers.validateHoliday(appointmentDate, fullOptions.timeAllowHolidays);
            if (!holidayValidation.statut) {
                return { ...result, message: 'Les rendez-vous ne sont pas possibles les jours fériés' };
            }


            // Vérifier si le créneau est libre
            const timeSlotCheck = await AppointmentsHelpers.getTimeSlots({
                serviceId: data.service,
                storeId: data.store,
                dateTime: data.start_time,
                userId: data.userId
            });

            if (!timeSlotCheck.isFree) {
                return { ...result, message: 'Ce créneau horaire n\'est pas disponible' };
            }

            return {
                statut: true,
                message: 'Le créneau horaire est valide',
                data: null
            };
        } catch (error) {
            return {
                ...result,
                message: (error as Error).message
            };
        }
    }


    static async cleanupPendingAppointments(): Promise<void> {
        let dbTransaction = null;
        try {
            // Find all pending payment transactions older than 6 minutes
            const pendingTransactions = await TransactionModel.findAll({
                where: {
                    payment_statut: Status.PAYMENT_PENDING,
                    created_at: {
                        [Op.lt]: new Date(Date.now() - (10 * 60 * 1000)) // 10 minutes ago
                    }
                }
            });

            if (pendingTransactions.length === 0) {
                throw new Error('No pending transactions found');
            }

            // Get appointment references from transactions
            const appointmentReferences = pendingTransactions.map(t => t.get('linked_reference'));


            // Find associated appointments
            const appointmentsToDelete = await AppointmentModel.findAll({
                where: {
                    reference: appointmentReferences
                }
            });

            dbTransaction = await sequelizeDB.transaction();

            if (appointmentsToDelete.length) {
                // Check which appointments are not already in trash
                const existingTrashReferences = await AppointmentTrashModel.findAll({
                    where: {
                        reference: appointmentReferences
                    },
                    attributes: ['reference']
                });


                const existingTrashRefs = existingTrashReferences.map(trash => trash.reference);
                const appointmentsToTrash = appointmentsToDelete.filter(apt => 
                    !existingTrashRefs.includes(apt.reference)
                );


                // Copy appointments to trash table if they don't already exist
                if (appointmentsToTrash.length) {
                    const trashData = appointmentsToTrash.map(apt => ({
                        reference: apt.get('reference'),
                        shop_id: apt.get('shop_id'),
                        service_id: apt.get('service_id'), 
                        user_id: apt.get('user_id'),
                        start_time: apt.get('start_time'),
                        end_time: apt.get('end_time'),
                        more_detail: apt.get('more_detail') ? JSON.stringify(apt.get('more_detail')) : null,
                        status: apt.get('status'),
                        canceled_by: apt.get('canceled_by') || null,
                        canceled_motif: apt.get('canceled_motif') || null,
                        created_at: apt.get('created_at') || new Date(),
                        updated_at: apt.get('updated_at') || new Date(),
                    }));

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    await AppointmentTrashModel.bulkCreate(trashData as any, { transaction: dbTransaction });
                }

                // Delete appointments from main table
                await sequelizeDB.query('DELETE FROM appointments WHERE reference IN (:references)', { 
                    replacements: { references: appointmentReferences }, type: QueryTypes.DELETE, transaction: dbTransaction
                });
            }

            // Delete the pending transactions
            await TransactionModel.unscoped().destroy({
                where: {
                    payment_statut: Status.PAYMENT_PENDING,
                    created_at: {
                        [Op.lt]: new Date(Date.now() - (10 * 60 * 1000))
                    }
                },
                force: true,
                transaction: dbTransaction
            });

            await dbTransaction.commit();
            return;

        } catch (error) {
            if (dbTransaction) {
                await dbTransaction.rollback();
            }
            LogHelpers.showException(error as Error);
            return;
        }
    }
}