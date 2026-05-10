import apiHelpers from '../../helpers/apiHelpers'
import { Request, Response } from 'express'
import DepotModel from '../../../models/DepotModel'
import CompteModel from '../../../models/CompteModel'
import { LogHelpers } from '../../helpers/LogHelpers'
import { Sanitizer } from '../../helpers/sanitizer'

export default class DepotController {

    static async list(req: Request, res: Response): Promise<void> {
        const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }
        try {
            const currentPage = Number(req.query.page) || 1
            const limit = Number(req.query.limit) || apiHelpers.FETCH_LIMIT
            const offset = (currentPage - 1) * limit
            const { count, rows } = await DepotModel.findAndCountAll({
                limit, offset, order: [['created_at', 'DESC']]
            })
            responseJson.data = {
                pagination: apiHelpers.getPaginationFormat({ total: count, perPage: limit, currentPage }),
                list: rows.map((d) => d.get())
            }
            responseJson.statut = true
            res.status(200).json(responseJson)
        } catch (error) {
            LogHelpers?.showException?.(error as Error)
            res.status(400).json(apiHelpers.bindError(error as Error))
        }
    }

    static async getByCompte(req: Request, res: Response): Promise<void> {
        const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }
        try {
            const depots = await DepotModel.findAll({
                where: { compte_id: req.params.compte_id },
                order: [['created_at', 'DESC']]
            })
            responseJson.statut = true
            responseJson.data = depots.map((d) => d.get())
            res.status(200).json(responseJson)
        } catch (error) {
            res.status(400).json(apiHelpers.bindError(error as Error))
        }
    }

    static async create(req: Request, res: Response): Promise<void> {
        const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }
        try {
            const data = req.body
            const nowDate = Sanitizer.getTimeByTimezone()
            const numeroTransaction = await Sanitizer.uniqueData(DepotModel, 'numero_transaction', Sanitizer.generateNum(8, 'DEP'))

            // Créer le dépôt
            const depot = await DepotModel.create({
                compte_id: data.compte_id,
                client_id: data.client_id,
                numero_transaction: numeroTransaction,
                montant: data.montant,
                date_depot: data.date_depot || nowDate,
                mode_paiement: data.mode_paiement || null,
                reference: data.reference || null,
                observation: data.observation || null,
                status: 'success',
                created_at: nowDate,
                updated_at: nowDate,
            })

            // Mettre à jour le solde du compte
            const compte = await CompteModel.findOne({ where: { id: data.compte_id } })
            if (compte) {
                const nouveauSolde = Number(compte.getDataValue('solde')) + Number(data.montant)
                await compte.update({ solde: nouveauSolde, updated_at: nowDate })
            }

            responseJson.statut = true
            responseJson.message = 'Dépôt enregistré avec succès'
            responseJson.data = depot.get()
            res.status(201).json(responseJson)
        } catch (error) {
            LogHelpers?.showException?.(error as Error)
            res.status(400).json(apiHelpers.bindError(error as Error))
        }
    }
}