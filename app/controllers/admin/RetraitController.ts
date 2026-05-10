import apiHelpers from '../../helpers/apiHelpers'
import { Request, Response } from 'express'
import RetraitModel from '../../../models/RetraitModel'
import CompteModel from '../../../models/CompteModel'
import { LogHelpers } from '../../helpers/LogHelpers'
import { Sanitizer } from '../../helpers/sanitizer'

export default class RetraitController {

    static async list(req: Request, res: Response): Promise<void> {
        const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }
        try {
            const currentPage = Number(req.query.page) || 1
            const limit = Number(req.query.limit) || apiHelpers.FETCH_LIMIT
            const offset = (currentPage - 1) * limit
            const { count, rows } = await RetraitModel.findAndCountAll({
                limit, offset, order: [['created_at', 'DESC']]
            })
            responseJson.data = {
                pagination: apiHelpers.getPaginationFormat({ total: count, perPage: limit, currentPage }),
                list: rows.map((r) => r.get())
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
            const retraits = await RetraitModel.findAll({
                where: { compte_id: req.params.compte_id },
                order: [['created_at', 'DESC']]
            })
            responseJson.statut = true
            responseJson.data = retraits.map((r) => r.get())
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

            // Vérifier le solde
            const compte = await CompteModel.findOne({ where: { id: data.compte_id } })
            if (!compte) throw new Error('__messageFormatted__Compte introuvable')
            if (Number(compte.getDataValue('solde')) < Number(data.montant)) {
                throw new Error('__messageFormatted__Solde insuffisant pour effectuer ce retrait')
            }

            const numeroTransaction = await Sanitizer.uniqueData(RetraitModel, 'numero_transaction', Sanitizer.generateNum(8, 'RET'))

            // Créer le retrait
            const retrait = await RetraitModel.create({
                compte_id: data.compte_id,
                client_id: data.client_id,
                numero_transaction: numeroTransaction,
                montant: data.montant,
                date_retrait: data.date_retrait || nowDate,
                mode_paiement: data.mode_paiement || null,
                motif: data.motif || null,
                observation: data.observation || null,
                status: 'success',
                created_at: nowDate,
                updated_at: nowDate,
            })

            // Mettre à jour le solde du compte
            const nouveauSolde = Number(compte.getDataValue('solde')) - Number(data.montant)
            await compte.update({ solde: nouveauSolde, updated_at: nowDate })

            responseJson.statut = true
            responseJson.message = 'Retrait enregistré avec succès'
            responseJson.data = retrait.get()
            res.status(201).json(responseJson)
        } catch (error) {
            LogHelpers?.showException?.(error as Error)
            res.status(400).json(apiHelpers.bindError(error as Error))
        }
    }
}