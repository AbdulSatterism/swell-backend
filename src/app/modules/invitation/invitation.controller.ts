/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import sendResponse from '../../../shared/sendResponse';
import catchAsync from '../../../shared/catchAsync';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { invitationService } from './invitaiton.services';

const sendInvitaion = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await invitationService.sendInvitaioin(req.body);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'all nearest group by coresponding user group',
      data: result,
    });
  },
);

const updatedInvited = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await invitationService.updatedInvite(
      req.params.id,
      req.body,
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'invited updated successfully!',
      data: result,
    });
  },
);

// const sendInvitaion = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { senderGroupId, receiverGroupId } = req.body;

//     const result = await invitationService.sendInvitaioin(
//       senderGroupId,
//       receiverGroupId,
//     );

//     sendResponse(res, {
//       success: true,
//       statusCode: StatusCodes.OK,
//       message: 'all nearest group by coresponding user group',
//       data: result,
//     });
//   },
// );

export const invitationController = {
  sendInvitaion,
  updatedInvited,
};
