import AdminLogModel from '../../models/AdminLogModel'

interface AdminLogPayload {
  admin_id: number | null
  link: string
  body: string | null
  http_method: string
  http_code: number
}

const buffer: AdminLogPayload[] = []
const BATCH_SIZE = 50
const FLUSH_INTERVAL = 3000

//Ajoute un log au buffer et flush si le buffer est plein
export function pushAdminLog(log: AdminLogPayload) {
  buffer.push(log)
  if (buffer.length >= BATCH_SIZE) flush()
}

//Vide le buffer et enregistre les logs dans la base de données
async function flush() {
  if (!buffer.length) return
  const logs = buffer.splice(0, buffer.length)
  try {
    await AdminLogModel.bulkCreate(logs)
  } catch (err) {
    console.error('❌ AdminLog insert error:', err)
  }
}

//Vide le buffer et enregistre les logs dans la base de données toutes les 3 secondes
setInterval(flush, FLUSH_INTERVAL)
process.on('SIGINT', flush)
process.on('SIGTERM', flush)
