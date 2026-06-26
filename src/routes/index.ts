import { Router } from "express";
import { authRoutes } from "../app/module/auth/auth.route";
import { jobRoutes } from "../app/module/job/job.route";



const router = Router();

router.use("/auth", authRoutes);
router.use("/job", jobRoutes);

export const indexRoutes = router;