/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { messageServices } from './message.services';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

const createMessage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await messageServices.createMessageIntoGroup(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'message send ok',
      data: result,
    });
  },
);

export const messageControllers = {
  createMessage,
};
