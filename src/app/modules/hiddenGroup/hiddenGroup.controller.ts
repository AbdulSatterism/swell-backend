import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { hiddenGroupService } from './hiddenGroup.services';

const createHiddenGroup = catchAsync(async (req, res) => {
  const result = await hiddenGroupService.createHiddenGroup(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'One group hidden succefully',
    data: result,
  });
});

export const hiddenGroupControllers = {
  createHiddenGroup,
};
