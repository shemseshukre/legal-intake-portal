import { Router } from "express";

import {
  getLegalRequests,
  getLegalRequest,
  createLegalRequestHandler,
} from "../controllers/legalRequestController.js";

import upload from "../middleware/upload.js";

const router = Router();

router.get("/", getLegalRequests);

router.get("/:id", getLegalRequest);

router.post(
  "/",
  upload.single("file"),
  createLegalRequestHandler,
);

export default router;