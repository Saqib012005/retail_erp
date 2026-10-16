import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { authorize } from '../middleware/authorize.js'
import { getUserLogsHandler } from '../controllers/userLogs.controller.js'

const router = Router()

router.use(authMiddleware)

router.get(
  '/',
  authorize('AUDIT_LOG_VIEW'),
  getUserLogsHandler,
)

export default router