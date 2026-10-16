import { Router } from "express";
import * as accountGroupController from "../../../controllers/admin/finance/accountGroup.controller.js";
import { authMiddleware } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/authorize.js";

const router = Router();

router.use(authMiddleware);

// Groups
router.get(
  "/groups",
  authorize("ACCOUNT_GROUP_VIEW"),
  accountGroupController.getGroups
);

// Sub Groups
router.get(
  "/sub-groups/:groupId",
  authorize("ACCOUNT_GROUP_VIEW"),
  accountGroupController.getSubGroups
);

// Account Groups
router.get(
  "/active",
  authorize("ACCOUNT_GROUP_VIEW"),
  accountGroupController.getActiveAccountGroups
);

router.get(
  "/",
  authorize("ACCOUNT_GROUP_VIEW"),
  accountGroupController.getAccountGroups
);

router.get(
  "/:id",
  authorize("ACCOUNT_GROUP_VIEW"),
  accountGroupController.getAccountGroupById
);

router.post(
  "/",
  authorize("ACCOUNT_GROUP_CREATE"),
  accountGroupController.createAccountGroup
);

router.put(
  "/:id",
  authorize("ACCOUNT_GROUP_EDIT"),
  accountGroupController.updateAccountGroup
);

router.delete(
  "/:id",
  authorize("ACCOUNT_GROUP_DELETE"),
  accountGroupController.deleteAccountGroup
);

export default router;