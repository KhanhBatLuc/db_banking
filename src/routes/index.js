import express from "express";

import { authRouter } from "./auth.route";
import { userRoute } from "./user.route";
import { transactionRouter } from "./transaction.route";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/user", userRoute);
router.use("/transaction", transactionRouter);

export const api = router;
