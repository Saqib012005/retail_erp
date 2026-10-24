import { Request, Response } from "express";
import type {
  CreateBusinessLocationInput,
  UpdateBusinessLocationInput,
  
} from '../../../types/businessLocation.types.js';
import {createBusinessLocation,getBusinessLocationData,getBusinessLocationById,deleteBusinessLoaction,updateBusinessLocation} from '../../../services/admin/organization/BusinessLocation.service.js'
import { createAuditLog } from "../../../services/admin/userLogs.service.js";
import { AuthRequest } from "../../../middleware/auth.middleware.js";

const logOrgUnitAction = async (
  req: AuthRequest,
  action: string,
  description: string,
  level: "SUCCESS" | "ERROR" | "WARNING" | "INFO" = "SUCCESS"
): Promise<void> => {

  
  try {
    await createAuditLog({
      level,
      action,
      module: "Business Location",
      userId: req.user?.id ?? null,
      userName: req.user?.email ?? null,
      description,
      ipAddress: req.ip,
    });
  } catch (error) {
    console.error("Failed to create business location", error);
     
  }
};

export const createBusinessLocationController = async (
  req: Request,
  res: Response
) => {
  try {
    const data = req.body as CreateBusinessLocationInput;

    if (!data) {
      return res.status(400).json({
        success: false,
        message: 'Request body is required',
      });
    }

    const location = await createBusinessLocation(data);
      await logOrgUnitAction(
      req,
      "CREATED BUSINESS_LOCATION",
      `business_location: ${req.body.locationName }`
    );
    return res.status(201).json({
      success: true,
      message: 'Business location created successfully',
      data: location,
    });
  } catch (error: any) {
    console.error('Create Business Location Error:', error);
 await logOrgUnitAction(
      req,
      "FAILED_TO_CREATE_BUSINESS_LOCATION",
      `business_location: ${req.body.locationName }`
    );
    return res.status(500).json({
      success: false,
      message: error?.message || 'Failed to create business location',
    });
  }
}

export const getBusinessLocationController = async (
  req: Request,
  res: Response
) => {
   try {
     const location = await getBusinessLocationData();

  if (!location) {
      return res.status(404).json({
        message: "Location not found",
      });
    }

    return res.status(200).json({
      message: "Business locations fetched successfully",
      data: location,
    });
  }
   catch (error: any) {
    return res.status(500).json({
      message: "Failed to fetch business locations",
      error: error.message,
    });
  }
   
}

export const getBusinessLocationByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const result = await getBusinessLocationById(id);

    if (!result) {
      return res.status(404).json({
        message: "Business location not found",
      });
    }

    return res.status(200).json({
      message: "Business location fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to fetch business location",
      error: error.message,
    });
  }
};


export const deleteBusinessLocationController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const result = await deleteBusinessLoaction(id);
  await logOrgUnitAction(
      req,
      "DELETED_BUSINESS_LOCATION",
      `business_location: ${req.body.locationName }`
    );
    return res.status(200).json({
      message: "Business location deleted successfully",
      data: result,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    await logOrgUnitAction(
      req,
      "FAILED_TO_DELETE_BUSINESS_LOCATION",
      `business_location: ${req.body.locationName }`
    );
    return res.status(statusCode).json({
      message: statusCode === 404
        ? "Business location not found or already deleted"
        : "Failed to delete business location",
      error: error.message,
    });
  }
}

export const updateBusinessLocationController = async (
  req: Request,
  res: Response
) => {
  try {
    
    const id = Number(req.params.id);

    const result = await updateBusinessLocation(
      id,
      req.body
    );
      await logOrgUnitAction(
      req,
      "UPDATED_BUSINESS_LOCATION",
      `business_location: ${req.body.locationName }`
    );
    return res.status(200).json({
      message: "Business location updated successfully",
      data: result,
    });
  } catch (error: any) {
    await logOrgUnitAction(
      req,
      "FAILED_TO_UPDATE_BUSINESS_LOCATION",
      `business_location: ${req.body.locationName }`
    );
    return res.status(500).json({
      message: "Failed to update business location",
      error: error.message,
    });
  }
};
