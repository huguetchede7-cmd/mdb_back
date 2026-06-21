/* eslint-disable @typescript-eslint/no-explicit-any */

import express from 'express'
import apiHelpers from '../helpers/apiHelpers'

import { AdminAuthLoginValidation } from '../validations/admin/AdminAuthLoginValidation'
import { AuthAdminController } from '../controllers/admin/AuthAdminController'

import AccountAdminAppController from '../controllers/admin/AccountAdminAppController'
import { AdminAccountRegisterValidation } from '../validations/admin/AdminAccountRegisterValidation'

import { UserAdminValidation } from '../validations/admin/UserAdminValidation'
import AdminUserController from '../controllers/admin/AdminUserController'

import AdminRolePermissionAdminAppController from '../controllers/admin/AdminRolePermissionAdminAppController'
import { AdminPermission } from '../constants/admin-permission'
import { CheckAdminPermission } from '../middleware/CheckAdminPermission'

import ClientController from '../controllers/admin/ClientController'
import CompteController from '../controllers/admin/CompteController'
import DepotController from '../controllers/admin/DepotController'
import RetraitController from '../controllers/admin/RetraitController'

const router = express.Router()
const CAP = CheckAdminPermission.allow

// ================= AUTH =================
router.post('/auth/login', AdminAuthLoginValidation, AuthAdminController.loginWithEmail)
router.post('/accounts/create/admin', AdminAccountRegisterValidation, AccountAdminAppController.createAdmin)

// ================= ADMIN USERS =================
router.get('/app/user/administrator/all/roles', CAP([AdminPermission.ADMINS]), AdminRolePermissionAdminAppController.rolesListe)
router.get('/app/user/administrator/show/:id', CAP([AdminPermission.ADMINS]), AdminUserController.showUser)
router.get('/app/user/administrator', CAP([AdminPermission.ADMINS]), AdminUserController.listAdmin)

router.post('/app/user/administrator',
  CAP([AdminPermission.ADMINS]),
  UserAdminValidation.create,
  AdminUserController.createAdminWithRoles
)

router.put('/app/user/administrator/blockUser/:id', CAP([AdminPermission.ADMINS]), AdminUserController.blockUser)
router.put('/app/user/administrator/unblockUser/:id', CAP([AdminPermission.ADMINS]), AdminUserController.unblockUser)
router.put('/app/user/administrator/:id',
  CAP([AdminPermission.ADMINS]),
  UserAdminValidation.update,
  AdminUserController.updateAdminWithRoles
)

router.delete('/app/user/administrator/:id', CAP([AdminPermission.ADMINS]), AdminUserController.deleteAdmin)

// ================= CLIENTS =================
router.get('/app/clients', ClientController.list)
router.post('/app/clients', ClientController.create)
router.get('/app/clients/:id', ClientController.show)
router.put('/app/clients/:id', ClientController.update)
router.delete('/app/clients/:id', ClientController.destroy)

// ================= COMPTES =================
router.get('/app/comptes', CompteController.list)
router.post('/app/comptes', CompteController.create)
router.get('/app/comptes/client/:client_id', CompteController.getByClient)
router.get('/app/comptes/:id', CompteController.show)
router.delete('/app/comptes/:id', CompteController.destroy)

// ================= DEPOTS =================
router.get('/app/depots', DepotController.list)
router.post('/app/depots', DepotController.create)
router.get('/app/depots/compte/:compte_id', DepotController.getByCompte)

// ================= RETRAITS =================
router.get('/app/retraits', RetraitController.list)
router.post('/app/retraits', RetraitController.create)
router.get('/app/retraits/compte/:compte_id', RetraitController.getByCompte)

// ================= DASHBOARD =================
router.get('/app/dashboard/stats', async (req, res) => {
  const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON }

  try {
    const ClientModel = (await import('../../models/ClientModel')).default
    const CompteModel = (await import('../../models/CompteModel')).default
    const DepotModel = (await import('../../models/DepotModel')).default
    const RetraitModel = (await import('../../models/RetraitModel')).default
    const AdminRolePermissionModel = (await import('../../models/AdminRolePermissionModel')).default
    const AdminRoleModel = (await import('../../models/AdminRoleModel')).default

    const today = new Date().toISOString().split('T')[0]
    const authUserId = Number(req.headers['auth_user'])

    const userRoles = await AdminRolePermissionModel.findAll({
      where: { admin_id: authUserId },
      include: [{ model: AdminRoleModel, as: 'role', attributes: ['slug'] }]
    })

    const slugs = userRoles.map((r: any) => r.get({ plain: true }).role?.slug).filter(Boolean)
    const isAdmin = slugs.includes('admin') || slugs.length === 0
    const isCashier = slugs.includes('cashier') && !isAdmin

    const baseWhere = isCashier ? { created_by: authUserId } : {}
    const baseWhereToday = isCashier
      ? { created_by: authUserId, date_depot: today }
      : { date_depot: today }
    const baseWhereTodayRetrait = isCashier
      ? { created_by: authUserId, date_retrait: today }
      : { date_retrait: today }

    const [
      totalClients,
      totalComptes,
      totalDepots,
      totalRetraits,
      depotsAujourdhui,
      retraitsAujourdhui
    ] = await Promise.all([
      ClientModel.count(),
      CompteModel.count(),
      DepotModel.sum('montant', { where: baseWhere }),
      RetraitModel.sum('montant', { where: baseWhere }),
      DepotModel.sum('montant', { where: baseWhereToday }),
      RetraitModel.sum('montant', { where: baseWhereTodayRetrait }),
    ])

    const dernierDepots = await DepotModel.findAll({
      where: baseWhereToday,
      limit: 5,
      order: [['created_at', 'DESC']]
    })

    const dernierRetraits = await RetraitModel.findAll({
      where: baseWhereTodayRetrait,
      limit: 5,
      order: [['created_at', 'DESC']]
    })

    responseJson.statut = true
    responseJson.data = {
      total_clients: totalClients,
      total_comptes: totalComptes,
      total_depots: totalDepots || 0,
      total_retraits: totalRetraits || 0,
      depots_aujourdhui: depotsAujourdhui || 0,
      retraits_aujourdhui: retraitsAujourdhui || 0,
      derniers_depots: dernierDepots.map((d: any) => d.get()),
      derniers_retraits: dernierRetraits.map((r: any) => r.get())
    }

    res.status(200).json(responseJson)

  } catch (error) {
    res.status(400).json(apiHelpers.bindError(error as Error))
  }
})

// ================= TRANSACTIONS =================
router.get("/transactions", async (req, res) => {
  const responseJson = { ...apiHelpers.DEFAULT_RESPONSE_JSON };

  try {
    const DepotModel = (await import('../../models/DepotModel')).default;
    const RetraitModel = (await import('../../models/RetraitModel')).default;
    const ClientModel = (await import('../../models/ClientModel')).default;
    const CompteModel = (await import('../../models/CompteModel')).default;
    const UserModel = (await import('../../models/UserModel')).default;
    const AdminRolePermissionModel = (await import('../../models/AdminRolePermissionModel')).default;
    const AdminRoleModel = (await import('../../models/AdminRoleModel')).default;

    const authUserId = Number(req.headers['auth_user']) || null;

    const userRoles = authUserId ? await AdminRolePermissionModel.findAll({
      where: { admin_id: authUserId },
      include: [{ model: AdminRoleModel, as: 'role', attributes: ['slug'] }]
    }) : [];

    const slugs = userRoles.map((r: any) => r.get({ plain: true }).role?.slug).filter(Boolean);
    const isCashier = slugs.includes('cashier') && !slugs.includes('savings_officer') && !slugs.includes('admin');
    const whereClause = isCashier ? { created_by: authUserId } : {};

    const depots = await DepotModel.findAll({
      where: whereClause,
      include: [
        { model: ClientModel, as: 'client', attributes: ['first_name', 'last_name'] },
        { model: CompteModel, as: 'compte', attributes: ['numero_compte'] },
        { model: UserModel, as: 'creator', attributes: ['firstname', 'lastname'] }
      ],
      order: [['created_at', 'DESC']]
    });

    const retraits = await RetraitModel.findAll({
      where: whereClause,
      include: [
        { model: ClientModel, as: 'client', attributes: ['first_name', 'last_name'] },
        { model: CompteModel, as: 'compte', attributes: ['numero_compte'] },
        { model: UserModel, as: 'creator', attributes: ['firstname', 'lastname'] }
      ],
      order: [['created_at', 'DESC']]
    });

    const transactions = [
      ...depots.map((d: any) => {
        const data = d.get({ plain: true });
        return {
          id: data.id,
          numero_transaction: data.numero_transaction || `DEP-${data.id}`,
          client_nom: data.client?.last_name || 'Inconnu',
          client_prenom: data.client?.first_name || '',
          numero_compte: data.compte?.numero_compte || data.compte_id?.toString() || '',
          type: 'depot',
          montant: Number(data.montant || 0),
          date: data.date_depot || data.created_at,
          status: data.status || 'success',
          effectue_par: data.creator
            ? `${data.creator.firstname} ${data.creator.lastname}`
            : 'N/A'
        };
      }),
      ...retraits.map((r: any) => {
        const data = r.get({ plain: true });
        return {
          id: data.id,
          numero_transaction: data.numero_transaction || `RET-${data.id}`,
          client_nom: data.client?.last_name || 'Inconnu',
          client_prenom: data.client?.first_name || '',
          numero_compte: data.compte?.numero_compte || data.compte_id?.toString() || '',
          type: 'retrait',
          montant: Number(data.montant || 0),
          date: data.date_retrait || data.created_at,
          status: data.status || 'success',
          effectue_par: data.creator
            ? `${data.creator.firstname} ${data.creator.lastname}`
            : 'N/A'
        };
      })
    ];

    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    responseJson.statut = true;
    responseJson.data = transactions;
    res.json(responseJson);

  } catch (error: any) {
    console.error("❌ Erreur transactions:", error);
    res.status(500).json({ statut: false, message: error.message });
  }
});

// ================= LOGOUT =================
router.post('/app/auth/logout', AuthAdminController.logout)

export default router