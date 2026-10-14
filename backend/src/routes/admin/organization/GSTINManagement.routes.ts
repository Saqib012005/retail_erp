import express from 'express'

import { authMiddleware } from '../../../middleware/auth.middleware.js'
import {
    creategstDetailsController,
    getGSTDetailsController
} from '../../../controllers/admin/organization/GSTINManagement.controller.js'
import { authorize } from "../../../middleware/authorize.js";

const router = express.Router()
router.use(authMiddleware);
router.post('/gst',
  authorize("GSTIN_MANAGE"),
  creategstDetailsController);
router.get('/gst',
  authorize("GSTIN_VIEW"),
  getGSTDetailsController);


export default router