import apiHelpers from '../../helpers/apiHelpers'
import { Request, Response } from 'express'
import UserModel from '../../../models/UserModel'
import { ACCOUNT_TYPES } from '../../../models/AccountTypeModel'
import { LogHelpers } from '../../helpers/LogHelpers'
import { Op, WhereOptions } from 'sequelize'
import { matchedData, validationResult } from 'express-validator'
import { Sanitizer } from '../../helpers/sanitizer'
import { BcryptMake } from '../../helpers/bcryptHelpers'
import AdminRolePermissionModel from '../../../models/AdminRolePermissionModel'
import sequelizeDB from '../../../config/db'


interface UserWhereClause {
  account_type: number;
  [Op.or]?: Array<Record<string, { [Op.like]: string }>>;
}

export default class AdminUserController {

  static async listAdmin(req: Request, res: Response): Promise<void> {
    const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON };

    try {
      const currentPage = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || apiHelpers.FETCH_LIMIT;
      const offset = (currentPage - 1) * limit;

      const search = (req.query.search as string)?.trim() || null;
      // IMPORTANT : laisser Sequelize gérer le typage
      const whereClause: WhereOptions<UserWhereClause> = {
        account_type: ACCOUNT_TYPES.ADMIN
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
            account_type: ACCOUNT_TYPES.ADMIN
          },
          attributes: ['id', 'firstname', 'lastname', 'email', 'phone', 'avatar', 'ban_statut', 'created_at', 'email_verified_at'],
        }
      )

      if (!user) {
        throw new Error('__messageFormatted__user__' + 'Utilisateur non trouvé')
      }

      const permissions = await AdminRolePermissionModel.findAll({
        where: { admin_id: userId },
        attributes: ['id', 'role_id', 'admin_id', 'created_at'],
      });

      const user_ = user.get()

      responseJson.data = {
        user: user_,
        permissions
      }
      responseJson.statut = true
      responseJson.message = 'Liste des utilisateurs récupérée avec succès'
      res.status(200).json(responseJson)
    } catch (error) {
      res.status(400).json(apiHelpers.bindError(error as Error))
    }
  }

  static async createAdminWithRoles(req: Request, res: Response): Promise<void> {
    const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }

    const transaction = await sequelizeDB.transaction();

    try {
      /** Validation */
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

      /**Vérifier email */
      const existingUser = await UserModel.findOne({
        where: { email: data.email },
        transaction,
      })

      if (existingUser) {
        throw new Error('__messageFormatted__email__Un utilisateur avec cet email existe déjà')
      }
      /**Générer username */
      const randomName = Sanitizer.generateNum(10, 'user')
      const username = await Sanitizer.uniqueData(
        UserModel,
        'username',
        randomName
      )
      /**Créer admin */
      console.log("Password reçu :", data.password);
      const newAdmin = await UserModel.create(
        {
          username,
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          password: data.password ? await BcryptMake(data?.password) : await BcryptMake("123456"),
          account_type: ACCOUNT_TYPES.ADMIN,
          email_verified_at: nowDate,
          phone_verified_at: null,
          ban_statut: false,
          kyc: '-1',
          created_at: nowDate,
          updated_at: nowDate,
        },
        { transaction }
      )

      /** Créer les rôles */

      if (Array.isArray(data.role_ids) && data.role_ids.length > 0) {
        const permissionsToCreate = data.role_ids.map((role_id: number) => ({
          admin_id: newAdmin.id,
          role_id,
          created_at: nowDate,
        }))
        await AdminRolePermissionModel.bulkCreate(permissionsToCreate, {
          transaction,
        })
      }
      /** Commit */
      await transaction.commit()

      responseJson.statut = true
      responseJson.message = 'Admin et rôles créés avec succès'
      responseJson.data = {
        id: newAdmin.id,
        firstname: newAdmin.firstname,
        lastname: newAdmin.lastname,
        email: newAdmin.email,
        roles: data.role_ids ?? [],
        created_at: newAdmin.created_at,
      }

      res.status(200).json(responseJson)
      return;
    } catch (error) {
      await transaction.rollback()
      LogHelpers?.showException?.(error as Error)
      res.status(400).json(apiHelpers.bindError(error as Error))
      return;
    }
  }

  static async updateAdminWithRoles(req: Request, res: Response): Promise<void> {
    const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }
    const transaction = await sequelizeDB.transaction()

    try {
      /** Validation */
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
      const adminId = Number(req.params.id)

      /** Vérifier admin */
      const admin = await UserModel.findOne({
        where: {
          id: adminId,
          account_type: ACCOUNT_TYPES.ADMIN,
        },
        transaction,
      })

      if (!admin) {
        throw new Error('__messageFormatted__Administrateur introuvable')
      }

      /** Vérifier email*/
      if (data.email) {
        const existingUser = await UserModel.findOne({
          where: {
            email: data.email,
            id: { [Op.ne]: adminId },
          },
          transaction,
        })

        if (existingUser) {
          throw new Error('__messageFormatted__email__Un utilisateur avec cet email existe déjà')
        }
      }

      /** Mise à jour admin */
      await admin.update(
        {
          firstname: data.firstname ?? admin.firstname,
          lastname: data.lastname ?? admin.lastname,
          email: data.email ?? admin.email,
          password: data.password
            ? await BcryptMake(data.password)
            : admin.password,
          updated_at: nowDate,
        },
        { transaction }
      )

      /** Supprimer anciens rôles */
      await AdminRolePermissionModel.destroy({
        where: { admin_id: adminId },
        transaction,
      })

      /** Ajouter nouveaux rôles */
      if (Array.isArray(data.role_ids) && data.role_ids.length > 0) {
        const permissionsToCreate = data.role_ids.map((role_id: number) => ({
          admin_id: adminId,
          role_id,
          created_at: nowDate,
        }))

        await AdminRolePermissionModel.bulkCreate(permissionsToCreate, {
          transaction,
        })
      }

      /** Commit */
      await transaction.commit()

      responseJson.statut = true
      responseJson.message = 'Administrateur et rôles mis à jour avec succès'
      responseJson.data = {
        id: admin.id,
        firstname: admin.firstname,
        lastname: admin.lastname,
        email: admin.email,
        roles: data.role_ids ?? [],
        updated_at: nowDate,
      }

      res.status(200).json(responseJson)
      return;
    } catch (error) {
      await transaction.rollback()
      LogHelpers?.showException?.(error as Error)
      res.status(400).json(apiHelpers.bindError(error as Error))
      return;
    }
  }

  static async blockUser(req: Request, res: Response): Promise<void> {
    const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }

    try {
      const userId = req.params.id

      const user = await UserModel.findOne({
        where: {
          id: userId,
          account_type: ACCOUNT_TYPES.ADMIN
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
      return;

    } catch (error) {
      LogHelpers?.showException?.(error as Error)
      res.status(400).json(apiHelpers.bindError(error as Error))
      return;
    }
  }

  static async unblockUser(req: Request, res: Response): Promise<void> {
    const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }

    try {
      const userId = req.params.id

      const user = await UserModel.findOne({
        where: {
          id: userId,
          account_type: ACCOUNT_TYPES.ADMIN
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
      return;
    } catch (error) {
      LogHelpers?.showException?.(error as Error)
      res.status(400).json(apiHelpers.bindError(error as Error))
      return;
    }
  }
  static async deleteAdmin(req: Request, res: Response): Promise<void> {
  const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }
  try {
    const userId = req.params.id
    const user = await UserModel.findOne({
      where: { id: userId, account_type: ACCOUNT_TYPES.ADMIN }
    })
    if (!user) {
      throw new Error('__messageFormatted__Utilisateur non trouvé')
    }
    await user.destroy()
    responseJson.statut = true
    responseJson.message = 'Utilisateur supprimé avec succès'
    res.status(200).json(responseJson)
  } catch (error) {
    LogHelpers?.showException?.(error as Error)
    res.status(400).json(apiHelpers.bindError(error as Error))
  }
}
}