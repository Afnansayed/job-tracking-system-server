import status from "http-status";
import { IRequestUser } from "../../interfaces/request.interface";
import { prisma } from "../../lib/prisma";
import { ICreateJob, IUpdateJob } from "./job.interface";
import AppError from "../../errorHelpers/AppError";
import { Role } from "../../../generated/prisma/browser";
import { IPaginationOptions } from "../../interfaces/pagination.interface";
import { calculatePagination } from "../../helperFn/calculatePagination";

const createJob = async (payload: ICreateJob, userId: string) => {
  const result = await prisma.job.create({
    data: {
      ...payload,
      applicationDate: payload?.applicationDate
        ? new Date(payload.applicationDate)
        : undefined,
      userId,
    },
  });
  return result;
};

const updateJob = async (
  jobId: string,
  payload: IUpdateJob,
  user: IRequestUser,
) => {
  if (Object.keys(payload).length === 0) {
    throw new AppError(
      status.BAD_REQUEST,
      "At least one field is required to update.",
    );
  }
  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
    select: {
      userId: true,
    },
  });

  if (!job) {
    throw new AppError(status.NOT_FOUND, "Job not found");
  }

  if (user.role !== Role.ADMIN && job.userId !== user.id) {
    throw new AppError(
      status.FORBIDDEN,
      "You are not authorized to update this job",
    );
  }

  const result = await prisma.job.update({
    where: {
      id: jobId,
    },
    data: {
      ...payload,
      applicationDate: payload.applicationDate
        ? new Date(payload.applicationDate)
        : undefined,
    },
  });

  return result;
};

const getAllJobs = async (
  user: IRequestUser,
  paginationOptions: IPaginationOptions,
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);
  //    if user is admin, return all jobs, else return only jobs for the user
  const isValidUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
        id: true,
        role: true,
    },
  });

  if (!isValidUser)
    throw new AppError(
      status.UNAUTHORIZED,
      "User not found , please login again",
    );

  const where = isValidUser.role === Role.ADMIN ? {} : { userId: isValidUser.id };

  const queryOptions =
    isValidUser.role === Role.ADMIN
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

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      ...queryOptions,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    }),
    prisma.job.count({ where }),
  ]);

  return {
    meta: {
      page: page,
      limit: limit,
      total,
    },
    data: jobs,
  };
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
};

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
  getJobById,
  updateJob,
};
