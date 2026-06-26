import { Router } from "express";
import { jobController } from "./job.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/browser";
import { validateRequest } from "../../middleware/validateRequest";
import { createJobValidation } from "./job.validation";


const router:Router = Router();

router.get("/", checkAuth(Role.USER , Role.ADMIN), jobController.getAllJobs);
router.get("/:id", checkAuth(Role.USER , Role.ADMIN), jobController.getJobById);
router.post("/", checkAuth(Role.USER , Role.ADMIN), validateRequest(createJobValidation), jobController.createJob);
router.delete("/:id", checkAuth(Role.USER , Role.ADMIN), jobController.deleteJob);

export const jobRoutes = router;