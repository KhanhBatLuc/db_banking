import express from "express";

import { validate } from "../validations/validationCtrlTransaction";
import savingController from "../controller/savingController";
import { verifyTokenAdmin, verifyToken } from "../middlewares/auth.middlewares";

const router = express.Router();

router.post("/send-saving", verifyToken, savingController.sendSaving);

router.post("/receive-saving", verifyToken, savingController.receiveSaving);

router.get("/show-saving", verifyToken, savingController.showSaving);

export const SavingRouter = router;
