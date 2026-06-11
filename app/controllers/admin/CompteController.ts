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
        const numeroCompte = req.query.numero_compte as string | undefined

        const whereClause: any = {}
        if (numeroCompte) {
            whereClause.numero_compte = numeroCompte
        }

        const { count, rows } = await CompteModel.findAndCountAll({
            where: whereClause,
            include: [{ model: ClientModel, as: 'client', attributes: ['id', 'last_name', 'first_name', 'member_number'] }],
            limit,
            offset,
            order: [['created_at', 'DESC']],
        })

        // Si recherche par numero_compte, retourner directement le premier résultat
        if (numeroCompte) {
            const found = rows[0] ?? null
            if (!found) {
                responseJson.statut = false
                responseJson.message = 'Aucun compte trouvé'
                res.status(404).json(responseJson)
                return
            }
            responseJson.statut = true
            responseJson.data = found.get({ plain: true })
            res.status(200).json(responseJson)
            return
        }

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
    date_echeance: data.date_echeance || null,
    taux_interet: data.taux_interet || null,
    montant_versement_mensuel: data.montant_versement_mensuel || null,
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

        // Supprimer d'abord les dépôts et retraits liés
        const DepotModel = (await import('../../../models/DepotModel')).default
        const RetraitModel = (await import('../../../models/RetraitModel')).default

        await DepotModel.destroy({ where: { compte_id: req.params.id } })
        await RetraitModel.destroy({ where: { compte_id: req.params.id } })

        // Ensuite supprimer le compte
        await compte.destroy()

        responseJson.statut = true
        responseJson.message = 'Compte supprimé avec succès'
        res.status(200).json(responseJson)
    } catch (error) {
        res.status(400).json(apiHelpers.bindError(error as Error))
    }
}
}