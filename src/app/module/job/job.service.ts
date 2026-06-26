import status from "http-status";
import { IRequestUser } from "../../interfaces/request.interface";
import { prisma } from "../../lib/prisma";
import { ICreateJob } from "./job.interface";
import AppError from "../../errorHelpers/AppError";
import { Role } from "../../../generated/prisma/browser";

const createJob = async (payload: ICreateJob, userId: string) => {
  const result = await prisma.job.create({
    data: {
      applicationDate: payload?.applicationDate
        ? new Date(payload.applicationDate)
        : undefined,
      ...payload,
      userId,
    },
  });
  return result;
};

const getAllJobs = async (user: IRequestUser) => {
  //    if user is admin, return all jobs, else return only jobs for the user
  const isValidUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!isValidUser)
    throw new AppError(
      status.UNAUTHORIZED,
      "User not found , please login again",
    );

  const where = user.role === Role.ADMIN ? {} : { userId: user.id };
  const queryOptions =
    user.role === Role.ADMIN
      ? {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        }
      : undefined;

  return prisma.job.findMany({
    where,
    ...queryOptions,
    orderBy: {
      applicationDate: "desc",
    },
  });
};

const getJobById = async (jobId: string, user: IRequestUser) => {
  const isValidUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!isValidUser)
    throw new AppError(
      status.UNAUTHORIZED,
      "User not found , please login again",
    );

  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
  });

  if (!job) {
    throw new AppError(status.NOT_FOUND, "Job not found");
  }

  if (user.role !== Role.ADMIN && job.userId !== user.id) {
    throw new AppError(
      status.FORBIDDEN,
      "You are not authorized to access this job",
    );
  }

  return job;
}

const deleteJob = async (jobId: string, user: IRequestUser) => {
  const isValidUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!isValidUser)
    throw new AppError(
      status.UNAUTHORIZED,
      "User not found , please login again",
    );

    return prisma.job.delete({
      where: {
        id: jobId,
      },
    });
};



export const jobService = {
  createJob,
  getAllJobs,
  deleteJob,
  getJobById
};
