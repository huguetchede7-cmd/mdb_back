import { RequestHandler, Request } from 'express'
import { pushAdminLog } from '../helpers/adminLogBuffer'

export class AdminLogMiddleware {
  static process: RequestHandler = async (req, res, next) => {
    try {
      // Ecoute la fin de la réponse
      res.on('finish', () => {
        const adminId = req.headers?.['auth_user'] ?? null

        // I dont want to log this
        if (req.originalUrl.startsWith("/admin/app/reports/pending-requests")) {
          next();
          return
        }

        if (!req.originalUrl.startsWith('/admin/auth') && !adminId) {
          next();
          return
        }

        const safeBody = JSON.stringify(AdminLogMiddleware.safeBody(req as Request))

        //envoi des logs
        pushAdminLog({
          admin_id: adminId ? Number(adminId) : null,
          link: req.originalUrl,
          body: safeBody,
          http_method: req.method,
          http_code: res.statusCode
        })
      })
      next()
    } catch (error) {
      console.error('❌ AdminLogMiddleware Error:', error)
      next(error)
    }
  }

  // Supprime les clés contenant "password"
  static safeBody(req: Request): { [key: string]: string } {

    let newObj: { [key: string]: string } = {}

    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      newObj = req.body
    }
    for (const key of Object.keys(newObj)) {
      if (key.toLowerCase().includes('password')) {
        newObj[key] = "**************";
      }
    }
    return newObj
  }
}