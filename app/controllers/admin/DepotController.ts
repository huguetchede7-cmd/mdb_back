import apiHelpers from '../../helpers/apiHelpers'
import { Request, Response } from 'express'
import DepotModel from '../../../models/DepotModel'
import CompteModel from '../../../models/CompteModel'
import ClientModel from '../../../models/ClientModel'
import { LogHelpers } from '../../helpers/LogHelpers'
import { Sanitizer } from '../../helpers/sanitizer'

export default class DepotController {

   static async list(req: Request, res: Response): Promise<void> {
    const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }
    try {
        const currentPage = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || apiHelpers.FETCH_LIMIT
        const offset = (currentPage - 1) * limit

        const authUserId = Number(req.headers['auth_user']) || null
        const AdminRolePermissionModel = (await import('../../../models/AdminRolePermissionModel')).default
        const AdminRoleModel = (await import('../../../models/AdminRoleModel')).default

        const userRoles = authUserId ? await AdminRolePermissionModel.findAll({
            where: { admin_id: authUserId },
            include: [{ model: AdminRoleModel, as: 'role', attributes: ['slug'] }]
        }) : []

        const slugs = userRoles.map((r: any) => r.get({ plain: true }).role?.slug).filter(Boolean)
        const isCashier = slugs.includes('cashier') && !slugs.includes('savings_officer') && !slugs.includes('admin')
        const whereClause = isCashier ? { created_by: authUserId } : {}

        const { count, rows } = await DepotModel.findAndCountAll({
            where: whereClause,
            include: [
                { model: ClientModel, as: 'client', attributes: ['id', 'last_name', 'first_name'] },
                { model: CompteModel, as: 'compte', attributes: ['id', 'numero_compte'] }
            ],
            limit,
            offset,
            order: [['created_at', 'DESC']]
        })

        responseJson.data = {
            pagination: apiHelpers.getPaginationFormat({ total: count, perPage: limit, currentPage }),
            list: rows.map((d) => d.get({ plain: true }))
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
            attributes: [
                'id',
                'numero_transaction',
                'montant',
                'date_depot',
                'mode_paiement',
                'reference',
                'observation',
                'numero_versement',
                'status',
                'created_at'
            ],
            order: [['created_at', 'ASC']]
        })
        responseJson.statut = true
        responseJson.data = depots.map((d) => d.get({ plain: true }))
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

        // Vérifier le statut du compte
        const compteCheck = await CompteModel.findOne({ where: { id: data.compte_id } })
        if (!compteCheck) throw new Error('__messageFormatted__Compte introuvable')
        if (compteCheck.getDataValue('status') !== 'active') {
            throw new Error('__messageFormatted__Ce compte est inactif ou bloqué. Aucune opération n\'est possible.')
        }

        // Vérifier le statut du client
        const clientCheck = await ClientModel.findOne({ where: { id: data.client_id } })
        if (!clientCheck) throw new Error('__messageFormatted__Membre introuvable')
        if (clientCheck.getDataValue('status') !== 'active') {
            throw new Error('__messageFormatted__Ce membre est inactif ou bloqué. Aucune opération n\'est possible.')
        }

        const numeroTransaction = await Sanitizer.uniqueData(DepotModel, 'numero_transaction', Sanitizer.generateNum(8, 'DEP'))

        const authUserId = Number(req.headers['auth_user']) || null

const depot = await DepotModel.create({
    compte_id: data.compte_id,
    client_id: data.client_id,
    numero_transaction: numeroTransaction,
    montant: data.montant,
    date_depot: data.date_depot || nowDate,
    mode_paiement: data.mode_paiement || null,
    reference: data.reference || null,
    observation: data.observation || null,
    numero_versement: data.numero_versement || null,
    status: 'success',
    created_by: authUserId,
    created_at: nowDate,
    updated_at: nowDate,
})

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