import { Response, NextFunction } from "express";
import prisma from "../../config/prisma.js";
import { AuthRequest } from "../auth.middleware.js";
import { getUserScopes } from "../../utils/admin/securities/scope.helper.js";
import { canAccessScope } from "../../utils/admin/securities/scope.authorization.js";



export type ResourceScope = {
  organizationGroupId: number;
  organizationUnitId?: number;
};

export type ResourceResolver = (
  req: AuthRequest
) => Promise<ResourceScope | null>;

export const requireResourceScope = (
  resolveResourceScope: ResourceResolver
) => {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          message: "Authentication required",
        });
        return;
      }

      const resourceScope = await resolveResourceScope(req);

      if (!resourceScope) {
        res.status(404).json({
          message: "Resource not found",
        });
        return;
      }

      const scopes = await getUserScopes(req.user.id);

      const allowed = canAccessScope(
        scopes,
        resourceScope.organizationGroupId,
        resourceScope.organizationUnitId
      );

      if (!allowed) {
        res.status(403).json({
          message: "Access denied for this resource",
        });
        return;
      }

      next();
    } catch (error) {
      console.error("Resource scope authorization error:", error);

      res.status(500).json({
        message: "Scope authorization failed",
      });
    }
  };
};