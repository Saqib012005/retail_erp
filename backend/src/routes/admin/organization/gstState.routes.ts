
import { Router } from "express";
import { authMiddleware } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/authorize.js";

import {
  getGstStateTableHandler,
  getGstStateStatsHandler,
  getGstStateOptionsHandler,
  getGstStateByIdHandler,
  getLinkedStoresByState,
  updateGstStateHandler,
} from "../../../controllers/admin/organization/gstState.controller.js";

const router = Router();

router.use(authMiddleware);


router.get(
  "/stats",
  authorize("GSTIN_VIEW"),
  getGstStateStatsHandler
);


router.get(
  "/options",
  authorize("GSTIN_VIEW"),
  getGstStateOptionsHandler
);

// Get linked stores for a particular state
router.get(
  "/:id/linked-stores",
  authorize("GSTIN_VIEW"),
  getLinkedStoresByState
);

// Get GST State by ID
router.get(
  "/:id",
  authorize("GSTIN_VIEW"),
  getGstStateByIdHandler
);

// Update GST State configuration
router.patch(
  "/:id",
  authorize("GSTIN_MANAGE"),
  updateGstStateHandler
);

// Get all GST States
router.get(
  "/",
  authorize("GSTIN_VIEW"),
  getGstStateTableHandler
);

export default router