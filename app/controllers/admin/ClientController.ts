import apiHelpers from '../../helpers/apiHelpers'
import { Request, Response } from 'express'
import ClientModel from '../../../models/ClientModel'
import { LogHelpers } from '../../helpers/LogHelpers'
import { Op } from 'sequelize'
import { Sanitizer } from '../../helpers/sanitizer'

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
        ]
      }

      const { count, rows } = await ClientModel.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [['created_at', 'DESC']],
      })

      responseJson.data = {
        pagination: apiHelpers.getPaginationFormat({ total: count, perPage: limit, currentPage }),
        list: rows.map((c) => c.get()),
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

      // Générer numéro de membre unique
      const memberNumber = await Sanitizer.uniqueData(ClientModel, 'member_number', Sanitizer.generateNum(6, 'MDB'))

      const client = await ClientModel.create({
        last_name: data.last_name,
        first_name: data.first_name,
        birth_date: data.birth_date || null,
        gender: data.gender || null,
        address: data.address || null,
        neighborhood: data.neighborhood || null,
        district: data.district || null,
        city: data.city || null,
        primary_phone: data.primary_phone,
        secondary_phone: data.secondary_phone || null,
        member_number: memberNumber,
        join_date: data.join_date || null,
        account_type: data.account_type || null,
        status: data.status || 'active',
        id_document_type: data.id_document_type || null,
        id_document_number: data.id_document_number || null,
        created_at: nowDate,
        updated_at: nowDate,
      })

      responseJson.statut = true
      responseJson.message = 'Client créé avec succès'
      responseJson.data = client.get()
      res.status(200).json(responseJson)
    } catch (error) {
      LogHelpers?.showException?.(error as Error)
      res.status(400).json(apiHelpers.bindError(error as Error))
    }
  }

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
      const data = req.body
      await client.update({ ...data, updated_at: Sanitizer.getTimeByTimezone() })
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
