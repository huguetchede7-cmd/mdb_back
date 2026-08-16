import apiHelpers from '../../helpers/apiHelpers'
import { Request, Response } from 'express'
import ClientModel from '../../../models/ClientModel'
import { LogHelpers } from '../../helpers/LogHelpers'
import { Op } from 'sequelize'
import { Sanitizer } from '../../helpers/sanitizer'
import path from 'path'

export default class ClientController {

   static async list(req: Request, res: Response): Promise<void> {
    const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }
    try {
        const currentPage = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || apiHelpers.FETCH_LIMIT
        const offset = (currentPage - 1) * limit
        const search = (req.query.search as string)?.trim() || null

        const whereClause: any = {}

        if (search) {
            whereClause[Op.or] = [
                { last_name: { [Op.like]: `%${search}%` } },
                { first_name: { [Op.like]: `%${search}%` } },
                { primary_phone: { [Op.like]: `%${search}%` } },
                { member_number: { [Op.like]: `%${search}%` } },
            ]
        }

        const { count, rows } = await ClientModel.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            order: [['created_at', 'DESC']]
        })

        const clientsWithComptes = await Promise.all(rows.map(async (client) => {
            const CompteModel = (await import('../../../models/CompteModel')).default
            const nombreComptes = await CompteModel.count({ where: { client_id: client.getDataValue('id') } })
            return { ...client.get(), nombre_comptes: nombreComptes }
        }))

        responseJson.data = {
            pagination: apiHelpers.getPaginationFormat({ total: count, perPage: limit, currentPage }),
            list: clientsWithComptes
        }
        responseJson.statut = true
        responseJson.message = 'Liste des clients récupérée avec succès'
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

            // Génération automatique du numéro membre CMMB
           const timestamp = Date.now().toString().slice(-8)
const random = Math.floor(Math.random() * 900 + 100).toString()
const memberNumber = `cmmb-${new Date().getFullYear()}${timestamp}${random}`

            // Gestion de la photo
let photoPath: string | null = null;
if (req.files && req.files.photo) {
    const photo = req.files.photo as any;
    const fileName = `${memberNumber}_${Date.now()}${path.extname(photo.name)}`;
    const uploadPath = path.join(__dirname, '../../../public/uploads/clients', fileName);
    await photo.mv(uploadPath);
    photoPath = `uploads/clients/${fileName}`;
}
            const client = await ClientModel.create({
                last_name: data.last_name,
                first_name: data.first_name,
                birth_date: data.birth_date || null,
                gender: data.gender || null,
                address: data.address || null,
                neighborhood: data.neighborhood || null,
                district: data.district || null,
                city: data.city || 'Cotonou',
                primary_phone: data.primary_phone,
                secondary_phone: data.secondary_phone || null,
                id_document_type: data.id_document_type || null,
                id_document_number: data.id_document_number || null,
                member_number: memberNumber,
                join_date: data.join_date || nowDate,
                photo: photoPath,
                profession: data.profession || null,
                created_by: data.created_by || null,
                created_at: nowDate,
                updated_at: nowDate,
            })

            // Recharger le client pour avoir l'id correct
const clientCreated = await ClientModel.findOne({
    where: { member_number: memberNumber }
})

responseJson.statut = true
responseJson.message = 'Client créé avec succès'
responseJson.data = clientCreated?.get() ?? client.get()
res.status(201).json(responseJson)
            
        } catch (error: any) {
            LogHelpers?.showException?.(error as Error)

            if (error.name === 'SequelizeUniqueConstraintError') {
  responseJson.statut = false
  responseJson.message = "Un client avec ce numéro de téléphone ou ce numéro de pièce existe déjà."
  res.status(409).json(responseJson)
  return
}

            res.status(400).json(apiHelpers.bindError(error as Error))
        }
    }

    // Les autres méthodes restent les mêmes
    static async show(req: Request, res: Response): Promise<void> {
        const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }
        try {
            const client = await ClientModel.findOne({ where: { id: req.params.id } })
            if (!client) throw new Error('__messageFormatted__Client introuvable')

            responseJson.statut = true
            responseJson.data = client.get()
            res.status(200).json(responseJson)
        } catch (error) {
            res.status(400).json(apiHelpers.bindError(error as Error))
        }
    }

    static async update(req: Request, res: Response): Promise<void> {
        const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }
        try {
            const client = await ClientModel.findOne({ where: { id: req.params.id } })
            if (!client) throw new Error('__messageFormatted__Client introuvable')

            await client.update({ 
                ...req.body, 
                updated_at: Sanitizer.getTimeByTimezone() 
            })

            responseJson.statut = true
            responseJson.message = 'Client mis à jour avec succès'
            responseJson.data = client.get()
            res.status(200).json(responseJson)
        } catch (error) {
            res.status(400).json(apiHelpers.bindError(error as Error))
        }
    }

    static async destroy(req: Request, res: Response): Promise<void> {
        const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }
        try {
            const client = await ClientModel.findOne({ where: { id: req.params.id } })
            if (!client) throw new Error('__messageFormatted__Client introuvable')

            await client.destroy()
            responseJson.statut = true
            responseJson.message = 'Client supprimé avec succès'
            res.status(200).json(responseJson)
        } catch (error) {
            res.status(400).json(apiHelpers.bindError(error as Error))
        }
    }
}