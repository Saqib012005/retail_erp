import express from "express";
import {
  createBusinessLocationController,
  getBusinessLocationController,
  getBusinessLocationByIdController,
  deleteBusinessLocationController,
  updateBusinessLocationController,
} from "../../../controllers/admin/organization/BusinessLocation.controller.js";
import {authMiddleware }from '../../../middleware/auth.middleware.js'
import { authorize } from "../../../middleware/authorize.js";

import { requireScope } from "../../../middleware/scope.middleware.js";

const router = express.Router();

router.use(authMiddleware);

// CREATE
router.post(
  "/",
  authorize("BUSINESS_LOCATION_CREATE"),
  createBusinessLocationController
);

// GET ALL
router.get(
  "/",
  authorize("BUSINESS_LOCATION_VIEW"),
  getBusinessLocationController
);

router.get(
  "/:id",
  authorize("BUSINESS_LOCATION_VIEW"),
  requireScope({
    resource: "businessLocation",
    source: "params",
    field: "id",
  }),
  getBusinessLocationByIdController
);

// UPDATE
router.put(
  "/:id",
  authorize("BUSINESS_LOCATION_EDIT"),
  requireScope({
    resource: "businessLocation",
    source: "params",
    field: "id",
  }),
  updateBusinessLocationController
);

// DELETE
router.delete(
  "/:id",
  authorize("BUSINESS_LOCATION_DELETE"),
  requireScope({
    resource: "businessLocation",
    source: "params",
    field: "id",
  }),
  deleteBusinessLocationController
);

export default router;
