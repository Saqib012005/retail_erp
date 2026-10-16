
import { Router } from "express";
import * as ledgerController from "../../../controllers/admin/finance/ledger.controller.js";
import { authMiddleware } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/authorize.js";

const router = Router();

router.use(authMiddleware);

// Create ledger
router.post(
  "/",
  authorize("LEDGER_CREATE"),
  ledgerController.createLedgerHandler
);

// View all ledgers
router.get(
  "/",
  authorize("LEDGER_VIEW"),
  ledgerController.getLedgersHandler
);

// View ledger by ID
router.get(
  "/:id",
  authorize("LEDGER_VIEW"),
  ledgerController.getLedgerByIdHandler
);

// Update ledger
router.put(
  "/:id",
  authorize("LEDGER_EDIT"),
  ledgerController.updateLedgerHandler
);

// Delete ledger
router.delete(
  "/:id",
  authorize("LEDGER_DELETE"),
  ledgerController.deleteLedgerHandler
);

export default router;
