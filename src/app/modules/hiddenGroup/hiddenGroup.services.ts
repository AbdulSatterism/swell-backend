import { StatusCodes } from 'http-status-codes';
import { Group } from '../group/group.model';
import { THiddenGroup } from './hiddenGroup.interface';
import ApiError from '../../../errors/ApiError';
import { HiddenGroup } from './hiddenGroup.model';

const createHiddenGroup = async (payload: THiddenGroup) => {
  const { hiddenByGroup, hiddenGroup } = payload;

  const isExistHiddenByGroup = await Group.findById(hiddenByGroup);
  const isExishiddenGroup = await Group.findById(hiddenGroup);

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
