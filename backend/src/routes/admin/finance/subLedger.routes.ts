

import { Router } from 'express'
import * as subLedgerController from '../../../controllers/admin/finance/subLedger.controller.js'
import { authMiddleware } from '../../../middleware/auth.middleware.js'
import { authorize } from '../../../middleware/authorize.js'

const router = Router()

router.use(authMiddleware)

router.get(
  '/',
  authorize('SUB_LEDGER_VIEW'),
  subLedgerController.getSubLedgersHandler
)

router.post(
  '/',
  authorize('SUB_LEDGER_CREATE'),
  subLedgerController.createSubLedgerHandler
)

router.put(
  '/:id',
  authorize('SUB_LEDGER_EDIT'),
  subLedgerController.updateSubLedgerHandler
)

router.delete(
  '/:id',
  authorize('SUB_LEDGER_DELETE'),
  subLedgerController.deleteSubLedgerHandler
)

export default router