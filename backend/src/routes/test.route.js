import { Router } from "express";
import { testController } from "../controller/testController.js";

const router = Router();

router.get("/", testController);

export default router;
