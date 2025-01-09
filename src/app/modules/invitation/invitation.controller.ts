/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import sendResponse from '../../../shared/sendResponse';
import catchAsync from '../../../shared/catchAsync';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { invitationService } from './invitaiton.services';

// const sendInvitaion = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const result = await invitationService.sendInvitaioin(req.body);
//     sendResponse(res, {
//       success: true,
//       statusCode: StatusCodes.OK,
//       message: 'all nearest group by coresponding user group',
//       data: result,
//     });
//   },
// );

// const updatedInvited = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const result = await invitationService.updatedInvite(
//       req.params.id,
//       req.body,
//     );
//     sendResponse(res, {
//       success: true,
//       statusCode: StatusCodes.OK,
//       message: 'invited updated successfully!',
//       data: result,
//     });
//   },
// );

const sendInvitaion = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { senderGroupId, receiverGroupId } = req.body;
    const { id } = req.user;

    const result = await invitationService.sendInvitaioin(
      senderGroupId,
      receiverGroupId,
      id,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'send invitation',
      data: result,
    });
  },
);

const responseInvitation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { invitationId, response } = req.body;

    const result = await invitationService.responseInvitation(
      invitationId,
      response,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: result
        ? `invitation accepted and anable for chatting`
        : 'invitation rejected',
      data: result,
    });
  },
);

const getUserInvitation = catchAsync(async (req, res) => {
  const result = await invitationService.getUserInvitation(req?.user?.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'you got those group invitation',
    data: result,
  });
});

const getGroupInvitation = catchAsync(async (req, res) => {
  const result = await invitationService.getGroupInvitation(
    req?.params?.groupId,
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'got those group invitation',
    data: result,
  });
});

export const invitationController = {
  sendInvitaion,
  responseInvitation,
  getUserInvitation,
  getGroupInvitation,
};
