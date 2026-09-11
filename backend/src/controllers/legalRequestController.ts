import type { Request, Response } from "express";

import {
  getAllLegalRequests,
  getLegalRequestById,
  createLegalRequest,
} from "../models/legalRequestModel.js";

export async function getLegalRequests(
  _req: Request,
  res: Response,
) {
  try {
    const requests = await getAllLegalRequests();

    res.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error(
      "Error fetching legal requests:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch legal requests",
      error:
        error instanceof Error
          ? error.message
          : String(error),
    });
  }
}

export async function getLegalRequest(
  req: Request,
  res: Response,
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid request ID",
      });
      return;
    }

    const requests = await getLegalRequestById(id);

    if (
      !Array.isArray(requests) ||
      requests.length === 0
    ) {
      res.status(404).json({
        success: false,
        message: "Legal request not found",
      });
      return;
    }

    res.json({
      success: true,
      data: requests[0],
    });
  } catch (error) {
    console.error(
      "Error fetching legal request:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch legal request",
      error:
        error instanceof Error
          ? error.message
          : String(error),
    });
  }
}

export async function createLegalRequestHandler(
  req: Request,
  res: Response,
) {
  try {
    const {
      request_title,
      business_unit,
      counterparty,
      contract_type,
      contract_value,
      required_by_date,
      personal_data_involved,
      customer_type,
      risk_level,
      priority,
      description,
      status,
    } = req.body;

    if (
      !request_title ||
      !business_unit ||
      !counterparty ||
      !contract_type ||
      !required_by_date ||
      !personal_data_involved ||
      !customer_type ||
      !risk_level ||
      !priority ||
      !description
    ) {
      res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
      return;
    }

    const file = req.file;

    const result = await createLegalRequest({
      request_title,
      business_unit,
      counterparty,
      contract_type,
      contract_value: contract_value ?? "",
      required_by_date,
      personal_data_involved,
      customer_type,
      risk_level,
      priority,
      description,
      status,

      file_original_name: file?.originalname ?? null,
      file_stored_name: file?.filename ?? null,
      file_path: file?.path ?? null,
      file_mime_type: file?.mimetype ?? null,
      file_size: file?.size ?? null,
    });

    res.status(201).json({
      success: true,
      message: "Legal request created successfully",
      data: {
        ...result,
        file: file
          ? {
              originalName: file.originalname,
              storedName: file.filename,
              path: file.path,
              mimeType: file.mimetype,
              size: file.size,
            }
          : null,
      },
    });
  } catch (error) {
    console.error(
      "Error creating legal request:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Failed to create legal request",
      error:
        error instanceof Error
          ? error.message
          : String(error),
    });
  }
}