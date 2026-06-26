import z from "zod";
import { JobTaskStatus, Platform, ResponseStatus } from "../../../generated/prisma/enums"


 const jobSchema = z.object({
    applicationDate: z.string().optional(),
    companyName: z.string().min(1, "Company name is required"),
    companyWebsite: z.string().url("Invalid URL").optional(),
    email: z.string().email("Invalid email address").optional(),
    response: z.nativeEnum(ResponseStatus , {message:"Response is either Yes or No"}).optional(),
    jobTaskStatus: z.nativeEnum(JobTaskStatus , {message: "Job task status is invalid "}).optional(),
    platform: z.nativeEnum(Platform , {message: "Platform is invalid"}).optional(),
    position: z.string().min(1, "Position is required"),
    location: z.string().optional(),
    jobPostingUrl: z.string().url("Invalid URL").optional(),
    notes: z.string().optional(),
})

export const  createJobValidation = jobSchema;
export const  updateJobValidation = jobSchema.partial();
