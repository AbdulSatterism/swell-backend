import { StatusCodes } from 'http-status-codes';
import { Group } from '../group/group.model';
import { THiddenGroup } from './hiddenGroup.interface';
import ApiError from '../../../errors/ApiError';
import { HiddenGroup } from './hiddenGroup.model';

const createHiddenGroup = async (payload: THiddenGroup) => {
  const { hiddenByGroupId, hiddenGroupId } = payload;

  const isExistHiddenByGroup = await Group.findById(hiddenByGroupId);
  const isExishiddenGroup = await Group.findById(hiddenGroupId);

  if (!isExistHiddenByGroup) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'this  hiddenByGroup group not found',
    );
  }

  if (!isExishiddenGroup) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'this hiddenGroup group not found',
    );
  }

  const result = await HiddenGroup.create(payload);

  return result;
};

export const hiddenGroupService = { createHiddenGroup };
