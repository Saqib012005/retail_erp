
import { Router } from "express";
import {
  getCurrenciesHandler,
  createCurrencyHandler,
  updateCurrencyHandler,
  deleteCurrencyHandler,
  refreshCurrencyRateHandler,
} from "../../../controllers/admin/finance/currency.controller.js";
import { authMiddleware } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/authorize.js";

const router = Router();

router.use(authMiddleware);

// View currencies
router.get(
  "/",
  authorize("CURRENCY_VIEW"),
  getCurrenciesHandler
);

// Create currency
router.post(
  "/",
  authorize("CURRENCY_CREATE"),
  createCurrencyHandler
);

// Update currency
router.put(
  "/:id",
  authorize("CURRENCY_EDIT"),
  updateCurrencyHandler
);

// Delete currency
router.delete(
  "/:id",
  authorize("CURRENCY_DELETE"),
  deleteCurrencyHandler
);

// Refresh currency rate — requires edit permission
router.post(
  "/:id/refresh",
  authorize("CURRENCY_EDIT"),
  refreshCurrencyRateHandler
);

export default router;
