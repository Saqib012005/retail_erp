import { Router } from 'express'
import { authMiddleware } from '../../../middleware/auth.middleware.js'
import { getFormOptionsHandler, createEInvoiceHandler } from '../../../controllers/admin/utilities/eInvoice.controller.js'
import { authorize } from '../../../middleware/authorize.js'
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
  createEInvoiceHandler
)

export default router