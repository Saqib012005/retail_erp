import { Router } from "express";
import * as accountClassController  from "../../../controllers/admin/finance/accountClass.controller.js";
import { authMiddleware } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/authorize.js";
const router = Router();
router.use(authMiddleware);

router.get(
  "/",
  authorize("ACCOUNT_CLASS_VIEW"),
   accountClassController.getAccountClassesHandler
);

router.get(
  "/:id",
  authorize("ACCOUNT_CLASS_VIEW"),
  accountClassController.getAccountClassByIdHandler
);

// Create account class
router.post(
  "/",
  authorize("ACCOUNT_CLASS_CREATE"),
  accountClassController.createAccountClassHandler
);


router.get("/account-groups/active",
    authorize("ACCOUNT_CLASS_VIEW"),
    accountClassController.getActiveAccountGroupsHandler);
router.put("/:id", authorize("ACCOUNT_CLASS_UPDATE"), accountClassController.updateAccountClassHandler);
router.delete("/:id", authorize("ACCOUNT_CLASS_DELETE"), accountClassController.deleteAccountClassHandler);
router.get("/by-group/:accountGroupId", authorize("ACCOUNT_CLASS_VIEW"), accountClassController.getAccountClassesByGroupHandler);

export default router;