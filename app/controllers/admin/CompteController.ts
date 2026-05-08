import apiHelpers from '../../helpers/apiHelpers'
import { Request, Response } from 'express'
import CompteModel from '../../../models/CompteModel'
import ClientModel from '../../../models/ClientModel'
import { LogHelpers } from '../../helpers/LogHelpers'
import { Sanitizer } from '../../helpers/sanitizer'

export default class CompteController {

    static async list(req: Request, res: Response): Promise<void> {
        const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }
        try {
            const currentPage = Number(req.query.page) || 1
            const limit = Number(req.query.limit) || apiHelpers.FETCH_LIMIT
            const offset = (currentPage - 1) * limit

            const { count, rows } = await CompteModel.findAndCountAll({
                include: [{ model: ClientModel, as: 'client', attributes: ['id', 'last_name', 'first_name', 'member_number'] }],
                limit,
                offset,
                order: [['created_at', 'DESC']],
            })

            responseJson.data = {
                pagination: apiHelpers.getPaginationFormat({ total: count, perPage: limit, currentPage }),
                list: rows.map((c) => c.get()),
            }
            responseJson.statut = true
            responseJson.message = 'Liste des comptes récupérée avec succès'
            res.status(200).json(responseJson)
        } catch (error) {
            LogHelpers?.showException?.(error as Error)
            res.status(400).json(apiHelpers.bindError(error as Error))
        }
    }

    static async create(req: Request, res: Response): Promise<void> {
        const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }
        try {
            const data = req.body
            const nowDate = Sanitizer.getTimeByTimezone()

            // Vérifier que le client existe
            const client = await ClientModel.findOne({ where: { id: data.client_id } })
            if (!client) throw new Error('__messageFormatted__Client introuvable')

            // Générer numéro de compte unique
            const numeroCompte = await Sanitizer.uniqueData(CompteModel, 'numero_compte', Sanitizer.generateNum(8, 'CPT'))

            const compte = await CompteModel.create({
                client_id: data.client_id,
                numero_compte: numeroCompte,
                type_compte: data.type_compte,
                solde: data.solde_initial || 0,
                solde_initial: data.solde_initial || 0,
                status: data.status || 'active',
                date_ouverture: data.date_ouverture || nowDate,
                created_by: data.created_by || null,
                created_at: nowDate,
                updated_at: nowDate,
            })

            responseJson.statut = true
            responseJson.message = 'Compte ouvert avec succès'
            responseJson.data = compte.get()
            res.status(201).json(responseJson)
        } catch (error) {
            LogHelpers?.showException?.(error as Error)
            res.status(400).json(apiHelpers.bindError(error as Error))
        }
    }

    static async show(req: Request, res: Response): Promise<void> {
        const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }
        try {
            const compte = await CompteModel.findOne({
                where: { id: req.params.id },
                include: [{ model: ClientModel, as: 'client', attributes: ['id', 'last_name', 'first_name', 'member_number', 'primary_phone'] }],
            })
            if (!compte) throw new Error('__messageFormatted__Compte introuvable')
            responseJson.statut = true
            responseJson.data = compte.get()
            res.status(200).json(responseJson)
        } catch (error) {
            res.status(400).json(apiHelpers.bindError(error as Error))
        }
    }

    static async getByClient(req: Request, res: Response): Promise<void> {
        const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }
        try {
            const comptes = await CompteModel.findAll({
                where: { client_id: req.params.client_id },
                order: [['created_at', 'DESC']],
            })
            responseJson.statut = true
            responseJson.data = comptes.map((c) => c.get())
            res.status(200).json(responseJson)
        } catch (error) {
            res.status(400).json(apiHelpers.bindError(error as Error))
        }
    }

    static async destroy(req: Request, res: Response): Promise<void> {
        const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }
        try {
            const compte = await CompteModel.findOne({ where: { id: req.params.id } })
            if (!compte) throw new Error('__messageFormatted__Compte introuvable')
            await compte.destroy()
            responseJson.statut = true
            responseJson.message = 'Compte supprimé avec succès'
            res.status(200).json(responseJson)
        } catch (error) {
            res.status(400).json(apiHelpers.bindError(error as Error))
        }
    }
}