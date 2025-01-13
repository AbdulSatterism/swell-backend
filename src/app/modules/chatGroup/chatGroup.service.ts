import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import { ChatGroup } from './chatGroup.model';
import { Group } from '../group/group.model';

const allUserChattingGroup = async (userId: string) => {
  const isExistUser = await User.isExistUserById(userId);

  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'this user not found');
  }

  const chatGroups = await ChatGroup.find()
    .populate({
      path: 'group1',
      match: { invite: userId }, // Filter group1 by invite array containing userId
    })
    .populate({
      path: 'group2',
      match: { invite: userId }, // Filter group2 by invite array containing userId
    });

  // Filter chat groups to include only those where the user is in group1 or group2
  const filteredChatGroups = chatGroups.filter(
    chatGroup => chatGroup.group1 || chatGroup.group2,
  );

  return filteredChatGroups;
};

const chatGroupList = async (groupId: string) => {
  const isExistGroup = await Group.findById(groupId);

  if (!isExistGroup) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'this group not found');
  }

  const chatGroups = await ChatGroup.find({ group1: groupId })
    .populate({
      path: 'group1', // Populate group1 reference
      populate: {
        path: 'invite', // Populate invite field in group1
        model: 'User', // Reference the User collection
        select: 'name image _id', // Include only name, image, and _id
      },
    })
    .populate({
      path: 'group2', // Populate group2 reference
      populate: {
        path: 'invite', // Populate invite field in group2
        model: 'User', // Reference the User collection
        select: 'name image _id', // Include only name, image, and _id
      },
    });

  return chatGroups;
};

export const chatGroupServices = {
  allUserChattingGroup,
  chatGroupList,
};
