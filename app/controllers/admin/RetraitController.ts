import apiHelpers from '../../helpers/apiHelpers'
import { Request, Response } from 'express'
import RetraitModel from '../../../models/RetraitModel'
import CompteModel from '../../../models/CompteModel'
import ClientModel from '../../../models/ClientModel'
import { LogHelpers } from '../../helpers/LogHelpers'
import { Sanitizer } from '../../helpers/sanitizer'

export default class RetraitController {

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

        const { count, rows } = await RetraitModel.findAndCountAll({
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

         const compte = await CompteModel.findOne({ where: { id: data.compte_id } })
if (!compte) throw new Error('__messageFormatted__Compte introuvable')

// Vérifier le statut du compte
if (compte.getDataValue('status') !== 'active') {
    throw new Error('__messageFormatted__Ce compte est inactif ou bloqué. Aucune opération n\'est possible.')
}

// Vérifier le statut du membre
const clientCheck = await ClientModel.findOne({ where: { id: data.client_id } })
if (!clientCheck) throw new Error('__messageFormatted__Membre introuvable')
if (clientCheck.getDataValue('status') !== 'active') {
    throw new Error('__messageFormatted__Ce membre est inactif ou bloqué. Aucune opération n\'est possible.')
}

const typeCompte = compte.getDataValue('type_compte')
const dateEcheance = compte.getDataValue('date_echeance')

if (typeCompte === 'epargne_terme') {
    if (!dateEcheance) {
        throw new Error("__messageFormatted__Ce compte à terme ne peut pas faire l'objet d'un retrait : aucune date d'échéance définie")
    }
    const today = new Date()
    const echeance = new Date(dateEcheance)
    if (today < echeance) {
        const dateFormatee = echeance.toLocaleDateString('fr-FR')
        throw new Error(`__messageFormatted__Ce compte à terme est bloqué jusqu'au ${dateFormatee}. Aucun retrait n'est possible avant cette date`)
    }
}

const soldeActuel = Number(compte.getDataValue('solde'))
            const soldeInitial = Number(compte.getDataValue('solde_initial'))
            const montant = Number(data.montant)

            if (montant <= 0) {
                throw new Error('__messageFormatted__Le montant doit être supérieur à 0')
            }

            if (soldeActuel < montant) {
                throw new Error('__messageFormatted__Solde insuffisant pour effectuer ce retrait')
            }

            if ((soldeActuel - montant) < soldeInitial) {
                throw new Error(`__messageFormatted__Le solde minimum de ${soldeInitial.toLocaleString()} FCFA (solde d'ouverture) doit être conservé et ne peut pas être retiré`)
            }

           const numeroTransaction = await Sanitizer.uniqueData(RetraitModel, 'numero_transaction', Sanitizer.generateNum(8, 'RET'))
const authUserId = Number(req.headers['auth_user']) || null

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
    created_by: authUserId,
    created_at: nowDate,
    updated_at: nowDate,
})

            const nouveauSolde = soldeActuel - montant
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