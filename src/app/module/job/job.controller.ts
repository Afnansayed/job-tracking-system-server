import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { jobService } from "./job.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";


const createJob = catchAsync(async (req: Request, res: Response) => {
      const userId = req.user!.id;
    
      const result = await jobService.createJob(req.body, userId);

      sendResponse(res, {
        httpStatusCode:  status.CREATED,
        success: true,
        message: "Job created successfully",
        data: result,
      });
});

const updateJob = catchAsync(async (req: Request, res: Response) => {
    const user = req.user!;
    const jobId = req.params.id as string;

    const result = await jobService.updateJob(jobId , req.body , user);

    sendResponse(res, {
        httpStatusCode:  status.OK,
        success: true,
        message: "Job updated successfully",
        data: result,
      });
});

const getAllJobs = catchAsync(async (req: Request, res: Response) => {
      const user = req.user!;

      const result = await jobService.getAllJobs(user);

      sendResponse(res, {
        httpStatusCode:  status.OK,
        success: true,
        message: "Jobs retrieved successfully",
        data: result,
      });
});

const getJobById = catchAsync(async(req: Request , res: Response) => {
     const user = req.user!;
     const jobId = req.params.id as string;

     const result = await jobService.getJobById(jobId ,user)

     sendResponse(res , {
         httpStatusCode: status.OK,
         success: true,
         message: "Job retrieved successfully",
         data: result
     })
})

const deleteJob = catchAsync(async(req: Request , res: Response) => {
    const user = req.user!;
    const jobId = req.params.id as string;

    await jobService.deleteJob(jobId , user);

    sendResponse(res , {
        httpStatusCode: status.OK,
        success: true,
        message: "Job deleted successfully",
        data: null
    })
})

export const jobController = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob
};

