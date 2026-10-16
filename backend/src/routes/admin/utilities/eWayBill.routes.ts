
import { Router } from 'express'
import { authMiddleware } from '../../../middleware/auth.middleware.js'
import { authorize } from '../../../middleware/authorize.js'
import {
  getFormOptionsHandler,
  createEWayBillHandler,
} from '../../../controllers/admin/utilities/eWayBill.controller.js'

const router = Router()

router.use(authMiddleware)

router.get(
  '/form-options',
  authorize('INVOICE_GENERATOR'),
  getFormOptionsHandler
)

router.post(
  '/',
  authorize('INVOICE_GENERATOR'),
  createEWayBillHandler
)

export default router
