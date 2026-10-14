import prisma from "../../config/prisma.js";
import { AuthRequest } from "../auth.middleware.js";

export const resolveOrganizationGroupScope = async (
  req: AuthRequest
) => {
  const organizationGroupId = Number(req.params.id);

  if (!Number.isInteger(organizationGroupId)) {
    return null;
  }

  const organizationGroup = await prisma.organizationGroup.findUnique({
    where: {
      id: organizationGroupId,
    },
    select: {
      id: true,
    },
  });

  if (!organizationGroup) {
    return null;
  }

  return {
    organizationGroupId: organizationGroup.id,
  };
};

/**
 * Resolve the scope of an Organization Unit.
 *
 * Used for:
 * GET    /org-unit/:id
 * PUT    /org-unit/:id
 * DELETE /org-unit/:id
 */
export const resolveOrganizationUnitScope = async (
  req: AuthRequest
) => {
  const organizationUnitId = Number(req.params.id);

  if (!Number.isInteger(organizationUnitId)) {
    return null;
  }

  const organizationUnit = await prisma.organizationUnit.findUnique({
    where: {
      id: organizationUnitId,
    },
    select: {
      id: true,
      organizationGroupId: true,
    },
  });

  if (!organizationUnit) {
    return null;
  }

  return {
    organizationGroupId: organizationUnit.organizationGroupId,
    organizationUnitId: organizationUnit.id,
  };
};

/**
 * Resolve the scope of a Business Location.
 *
 * Business Location belongs to an Organization Unit,
 * and Organization Unit belongs to an Organization Group.
 *
 * Used for:
 * GET    /businessLocation/:id
 * PUT    /businessLocation/:id
 * DELETE /businessLocation/:id
 */
export const resolveBusinessLocationScope = async (
  req: AuthRequest
) => {
  const businessLocationId = Number(req.params.id);

  if (!Number.isInteger(businessLocationId)) {
    return null;
  }

  const businessLocation =
    await prisma.businessLocation.findUnique({
      where: {
        id: businessLocationId,
      },
      select: {
        id: true,
        parentOrganizationUnitId: true,
        parentOrganizationUnit: {
          select: {
            id: true,
            organizationGroupId: true,
          },
        },
      },
    });

  if (!businessLocation) {
    return null;
  }

  if (!businessLocation.parentOrganizationUnit) {
    return null;
  }

  return {
    organizationGroupId:
      businessLocation.parentOrganizationUnit.organizationGroupId,

    organizationUnitId:
      businessLocation.parentOrganizationUnit.id,
  };
};