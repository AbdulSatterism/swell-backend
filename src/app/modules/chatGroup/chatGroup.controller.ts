import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

import { chatGroupServices } from './chatGroup.service';

const allUserChattingGroup = catchAsync(async (req, res) => {
  const result = await chatGroupServices.allUserChattingGroup(req.user.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'all my chatting group here',
    data: result,
  });
});

export const chatGroupControllers = {
  allUserChattingGroup,
};