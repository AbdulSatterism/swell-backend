/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { groupServices } from './group.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

//create group
const createGroup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let coverPhoto;
    if (req.files && 'image' in req.files && req.files.image[0]) {
      coverPhoto = `/images/${req.files.image[0].filename}`;
    }

    const userId = req.user.id;

    const value = {
      coverPhoto,
      ...req.body,
    };

    const result = await groupServices.createGroupIntoDB(userId, value);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Group created successfully',
      data: result,
    });
  },
);

const getSpecificGroup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await groupServices.allGroupSpecificUser(req.user.id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'specific user group retriev successfully',
      data: result,
    });
  },
);

const myAllJoinedGroup = catchAsync(async (req, res) => {
  const result = await groupServices.myAllJoinedGroup(req.user.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'user joined all groups',
    data: result,
  });
});

// nearest all group
const getNearestGroup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await groupServices.getNearestAllGroup(req.user.id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'all nearest group by coresponding user group',
      data: result,
    });
  },
);

const leaveFromGroup = catchAsync(async (req, res) => {
  const { groupId, userId } = req.body;
  const result = await groupServices.leaveFromGroup(groupId, userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: `user ${userId} has left from the group`,
    data: result,
  });
});

// export const getAllGroupsSortedByDistance = async (req: Request, res: Response) => {
//   try {

//     res.status(200).json({
//       success: true,
//       message: 'Groups retrieved successfully',
//       count: nearestGroups.length,
//       data: nearestGroups
//     });
//   } catch (error) {
//     console.error('Error retrieving groups:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error instanceof Error ? error.message : 'Unknown error'
//     });
//   }
// };

export const groupController = {
  createGroup,
  getSpecificGroup,
  getNearestGroup,
  myAllJoinedGroup,
  leaveFromGroup,
};
