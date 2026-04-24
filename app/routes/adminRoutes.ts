import express from 'express'
import { AdminAuthLoginValidation } from '../validations/admin/AdminAuthLoginValidation'
import { AuthAdminController } from '../controllers/admin/AuthAdminController'
import AccountAdminAppController from '../controllers/admin/AccountAdminAppController'
import { AdminAccountRegisterValidation } from '../validations/admin/AdminAccountRegisterValidation'
import { AppSettingValidation } from '../validations/admin/AppSettingValidation'
import { UserAdminValidation } from '../validations/admin/UserAdminValidation'
import AdminUserController from '../controllers/admin/AdminUserController'
import AdminRolePermissionAdminAppController from '../controllers/admin/AdminRolePermissionAdminAppController'
import { AdminPermission } from '../constants/admin-permission'
import { CheckAdminPermission } from '../middleware/CheckAdminPermission'
import ClientController from '../controllers/admin/ClientController'


const router = express.Router()
const CAP = CheckAdminPermission.allow

// Accounts (admin)
router.post('/accounts/create/admin', AdminAccountRegisterValidation, AccountAdminAppController.createAdmin)
// Auths Routes
router.post('/auth/login', AdminAuthLoginValidation, AuthAdminController.loginWithEmail)

// 🌐 App Routes ****************************************


// Admin users
router.get('/app/user/administrator/all/roles', CAP([AdminPermission.ADMINS,]), AdminRolePermissionAdminAppController.rolesListe);
router.post('/app/user/administrator', CAP([AdminPermission.ADMINS]), UserAdminValidation.create, AdminUserController.createAdminWithRoles);
router.put('/app/user/administrator/:id', CAP([AdminPermission.ADMINS]), UserAdminValidation.update, AdminUserController.updateAdminWithRoles);
router.get('/app/user/administrator', CAP([AdminPermission.ADMINS]), AdminUserController.listAdmin);
router.get('/app/user/administrator/show/:id', CAP([AdminPermission.ADMINS]), AdminUserController.showUser);
router.put('/app/user/administrator/blockUser/:id', CAP([AdminPermission.ADMINS]), AdminUserController.blockUser);
router.put('/app/user/administrator/unblockUser/:id', CAP([AdminPermission.ADMINS]), AdminUserController.unblockUser);


// Clients
router.get('/app/clients', ClientController.list);
router.post('/app/clients', ClientController.create);
router.get('/app/clients/:id', ClientController.show);
router.put('/app/clients/:id', ClientController.update);
router.delete('/app/clients/:id', ClientController.destroy);

// Logout
router.post('/app/auth/logout', AuthAdminController.logout)

export default router;