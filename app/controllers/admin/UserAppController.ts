import apiHelpers from '../../helpers/apiHelpers'
import { Request, Response } from 'express'
import UserModel from '../../../models/UserModel'
import { ACCOUNT_TYPES } from '../../../models/AccountTypeModel'
import { LogHelpers } from '../../helpers/LogHelpers'
import { Op, WhereOptions } from 'sequelize'
import { matchedData, validationResult } from 'express-validator'
import { Sanitizer } from '../../helpers/sanitizer'
import { BcryptMake } from '../../helpers/bcryptHelpers'
import { addEmailJob } from '../../../config/queue'
import { EmailHelpers } from '../../helpers/EmailHelpers'
import UsersHelpers from '../../helpers/UsersHelpers'

interface UserWhereClause {
  account_type: number;
  [Op.or]?: Array<Record<string, { [Op.like]: string }>>;
}

export default class UserAppController {

  static async listUsers(req: Request, res: Response): Promise<void> {
    const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON };

    try {
      const currentPage = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || apiHelpers.FETCH_LIMIT;
      const offset = (currentPage - 1) * limit;

      const search = (req.query.search as string)?.trim() || null;
      // IMPORTANT : laisser Sequelize gérer le typage
      const whereClause: WhereOptions<UserWhereClause> = {
        account_type: ACCOUNT_TYPES.CLIENT
      };

      if (search) {
        (whereClause as UserWhereClause)[Op.or] = [
          { firstname: { [Op.like]: `%${search}%` } },
          { lastname: { [Op.like]: `%${search}%` } }
        ];
      }

      const { count: totalUsers, rows: users } = await UserModel.findAndCountAll({
        where: whereClause,
        attributes: [
          'id',
          'firstname',
          'lastname',
          'email',
          'phone',
          'avatar',
          'ban_statut',
          'email_verified_at',
          'created_at'
        ],
        limit,
        offset,
        order: [['created_at', 'DESC']]
      });

      if (!users.length) {
        throw new Error('__messageFormatted__Aucun utilisateur trouvé');
      }

      responseJson.data = {
        pagination: apiHelpers.getPaginationFormat({
          total: totalUsers,
          perPage: limit,
          currentPage
        }),
        list: users.map((u) => u.get())
      };

      responseJson.statut = true;
      responseJson.message = 'Liste des utilisateurs récupérée avec succès';

      res.status(200).json(responseJson);
      return;

    } catch (error) {
      LogHelpers?.showException?.(error as Error);
      res.status(400).json(apiHelpers.bindError(error as Error));
      return;
    }
  }

  static async showUser(req: Request, res: Response): Promise<void> {
    const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }
    try {
          const userId = req.params.id;
          const user = await UserModel.findOne(
            {
              where: {
                id: userId,
                account_type: ACCOUNT_TYPES.CLIENT
              },
              attributes: ['id', 'firstname', 'lastname', 'email', 'phone', 'avatar','ban_statut','email_verified_at','created_at'],            }
          )
      if (!user){
        throw new Error('__messageFormatted__user__' + 'Utilisateur non trouvé')
      }
      const user_ = user.get()
      responseJson.data = user_
      responseJson.statut = true
      responseJson.message = 'Liste des utilisateurs récupérée avec succès'
      res.status(200).json(responseJson)
    } catch (error) {
      res.status(400).json(apiHelpers.bindError(error as Error))
    }
  }

  static async createUser(req: Request, res: Response): Promise<void> {
    const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }

    try {
      // 1️⃣ Validation des données
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        responseJson.statut = false
        responseJson.message = 'Données invalides'
        responseJson.errors = Sanitizer.arrayToKeyObject(
          'path',
          errors.array() as []
        )
        res.status(400).json(responseJson)
        return
      }

      const data = matchedData(req)
      const nowDate = Sanitizer.getTimeByTimezone()

      // 2️⃣ Vérifier si l’email existe déjà
      const existingUser = await UserModel.findOne({
        where: { email: data.email }
      })

      if (existingUser) {
        throw new Error('__messageFormatted__email__Un utilisateur avec cet email existe déjà')
      }

      // Vérifier si le numéro de téléphone existe déjà
      const cleanPhone = Sanitizer.phoneClean(data?.phone)
      if (!cleanPhone) {
        throw new Error('__messageFormatted__phone__Le numéro de téléphone est invalide')
      }

      const existingPhone = await UserModel.findOne({
        where: { phone: cleanPhone }
      })
      if (existingPhone) {
        throw new Error('__messageFormatted__phone__Un utilisateur avec ce numéro de téléphone existe déjà')
      }

      // 3️⃣ Génération username unique
      const randomName = Sanitizer.generateNum(10, 'user')
      const username = await Sanitizer.uniqueData(
        UserModel,
        'username',
        randomName
      )

      const tempPassword = UsersHelpers.generateSecurePassword({length: 8})

      const newUser = await UserModel.create({
        username,
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        phone: cleanPhone,
        password: await BcryptMake(tempPassword),
        account_type: ACCOUNT_TYPES.CLIENT,
        email_verified_at: nowDate,
        phone_verified_at: null,
        ban_statut: false,
        kyc: '-1',
        created_at: nowDate,
        updated_at: nowDate
      })

      // Envoyer un email de confirmation au patient
      await addEmailJob('welcome_with_validate_email', {
        email: data.email ?? '',
        object: `Bienvenue sur ${process.env.APP_NAME}`,
        emailData: {
          mailRef: `ref-${username}` ,
          mailType: EmailHelpers.TYPE_WELCOME_NEW_CLIENT,
          email: data.email ?? '',
          password:tempPassword ?? "",
        }
      }, { delay: 5000 });

      responseJson.statut = true
      responseJson.message = 'Utilisateur créé avec succès'
      responseJson.data = {
        id: newUser.id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
        phone: newUser.phone,
        created_at: newUser.created_at
      }
      res.status(200).json(responseJson);
    } catch (error) {
      LogHelpers?.showException?.(error as Error)
      res.status(400).json(apiHelpers.bindError(error as Error))
    }
  }

  static async updateUser(req: Request, res: Response): Promise<void> {
    const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        responseJson.statut = false
        responseJson.message = 'Données invalides'
        responseJson.errors = Sanitizer.arrayToKeyObject('path', errors.array() as [])
        res.status(400).json(responseJson)
        return
      }

      const userId = parseInt(req.params.id as string)
      const data = matchedData(req)
      const nowDate = Sanitizer.getTimeByTimezone()

      const user = await UserModel.findOne({
        where: {
          id: userId,
          account_type: ACCOUNT_TYPES.CLIENT
        }
      })

      if (!user) {
        throw new Error('__messageFormatted__Utilisateur non trouvé')
      }

      // Vérifier email unique
      if (data.email) {
        const emailExists = await UserModel.findOne({
          where: {
            email: data.email,
            id: { [Op.ne]: userId }
          }
        })

        if (emailExists) {
          throw new Error('__messageFormatted__email__Cet email est déjà utilisé')
        }
      }

      // Vérifier si le numéro de téléphone existe déjà
      const cleanPhone = Sanitizer.phoneClean(data?.phone)
      if (!cleanPhone) {
        throw new Error('__messageFormatted__phone__Le numéro de téléphone est invalide')
      }
      
      const phoneExists = await UserModel.findOne({
        where: { phone: cleanPhone, id: { [Op.ne]: userId } }
      })
      if (phoneExists) {
        throw new Error('__messageFormatted__phone__Cet numéro de téléphone est déjà utilisé')
      }

      await user.update(
        {
          firstname: data.firstname ?? user.firstname,
          lastname: data.lastname ?? user.lastname,
          email: data.email ?? user.email,
          phone: data.phone ? Sanitizer.phoneClean(data.phone) : user.phone,
          updated_at: nowDate
        }
      )

      responseJson.statut = true
      responseJson.message = 'Utilisateur mis à jour avec succès'
      responseJson.data = user.get()
      res.status(200).json(responseJson)
    } catch (error) {
      LogHelpers?.showException?.(error as Error)
      res.status(400).json(apiHelpers.bindError(error as Error))
      return
    }
  }

  static async blockUser(req: Request, res: Response): Promise<void> {
    const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }

    try {
      const userId = req.params.id

      const user = await UserModel.findOne({
        where: {
          id: userId,
          account_type: ACCOUNT_TYPES.CLIENT
        }
      })

      if (!user) {
        throw new Error('__messageFormatted__Utilisateur non trouvé')
      }

      if (user.ban_statut === true) {
        throw new Error('__messageFormatted__Utilisateur déjà bloqué')
      }

      await user.update({
        ban_statut: true,
        updated_at: Sanitizer.getTimeByTimezone()
      })

      responseJson.statut = true
      responseJson.message = 'Utilisateur bloqué avec succès'
      res.status(200).json(responseJson)

    } catch (error) {
      LogHelpers?.showException?.(error as Error)
      res.status(400).json(apiHelpers.bindError(error as Error))
    }
  }

  static async unblockUser(req: Request, res: Response): Promise<void> {
    const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }

    try {
      const userId = req.params.id

      const user = await UserModel.findOne({
        where: {
          id: userId,
          account_type: ACCOUNT_TYPES.CLIENT
        }
      })

      if (!user) {
        throw new Error('__messageFormatted__Utilisateur non trouvé')
      }

      if (user.ban_statut === false) {
        throw new Error('__messageFormatted__Utilisateur déjà actif')
      }

      await user.update({
        ban_statut: false,
        updated_at: Sanitizer.getTimeByTimezone()
      })

      responseJson.statut = true
      responseJson.message = 'Utilisateur débloqué avec succès'
      res.status(200).json(responseJson)
    } catch (error) {
      LogHelpers?.showException?.(error as Error)
      res.status(400).json(apiHelpers.bindError(error as Error))
    }
  }
}