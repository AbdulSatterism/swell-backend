/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';
import getFilePath from '../../../shared/getFilePath';

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const value = {
      ...req.body,
    };

    await UserService.createUserFromDb(value);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message:
        'Please check your email to verify your account. We have sent you an OTP to complete the registration process.',
    });
  },
);

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await UserService.getAllUsers();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'all user retrieved successfully',
    data: result,
  });
});

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await UserService.getUserProfileFromDB(user);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile data retrieved successfully',
    data: result,
  });
});

//update profile
const updateProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    let image;
    if (req.files && 'image' in req.files && req.files.image[0]) {
      image = `/images/${req.files.image[0].filename}`;
    }

    const value = {
      image,
      ...req.body,
    };

    const result = await UserService.updateProfileToDB(user, value);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Profile updated successfully',
      data: result,
    });
  },
);

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getSingleUser(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User retrived successfully',
    data: result,
  });
});

// search by phone number
const searchByPhone = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.searchUserByPhone(
    req.query.searchTerm as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'get user by searching phone number',
    data: result,
  });
});

export const UserController = {
  createUser,
  getUserProfile,
  updateProfile,
  searchByPhone,
  getSingleUser,
  getAllUser,
};
