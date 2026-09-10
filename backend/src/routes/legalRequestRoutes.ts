import { Router } from "express";

import {
  getLegalRequests,
  getLegalRequest,
  createLegalRequestHandler,
} from "../controllers/legalRequestController.js";

const router = Router();

router.get("/", getLegalRequests);

router.get("/:id", getLegalRequest);

router.post("/", createLegalRequestHandler);

export default router;