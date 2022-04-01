import express from "express";

import { validate } from "../validations/validationCtrlTransaction";
import savingController from "../controller/savingController";
import { verifyTokenAdmin, verifyToken } from "../middlewares/auth.middlewares";

const router = express.Router();

router.get("/send-saving", verifyToken, savingController.sendSaving);

export const SavingRouter = router;
