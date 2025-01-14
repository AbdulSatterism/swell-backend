import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import { ChatGroup } from './chatGroup.model';
import { Group } from '../group/group.model';
import mongoose from 'mongoose';

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
  // Check if the group exists
  const isExistGroup = await Group.findById(groupId);

  if (!isExistGroup) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'This group not found');
  }

  // Fetch chat groups with required fields for invite users and last message
  const chatGroups = await ChatGroup.aggregate([
    { $match: { group1: new mongoose.Types.ObjectId(groupId) } }, // Match by group1
    {
      $lookup: {
        from: 'groups', // Join with the Group collection for group1
        localField: 'group1',
        foreignField: '_id',
        as: 'group1',
      },
    },
    {
      $lookup: {
        from: 'groups', // Join with the Group collection for group2
        localField: 'group2',
        foreignField: '_id',
        as: 'group2',
      },
    },
    { $unwind: '$group1' },
    { $unwind: '$group2' },
    {
      $lookup: {
        from: 'users', // Populate invite array in group1
        localField: 'group1.invite',
        foreignField: '_id',
        as: 'group1.invite',
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
              email: 1,
              image: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'users', // Populate invite array in group2
        localField: 'group2.invite',
        foreignField: '_id',
        as: 'group2.invite',
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
              email: 1,
              image: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'messages', // Fetch the last message for each roomId
        let: { roomId: '$roomId' },
        pipeline: [
          { $match: { $expr: { $eq: ['$roomId', '$$roomId'] } } },
          { $sort: { createdAt: -1 } },
          { $limit: 1 },
          {
            $project: {
              roomId: 1,
              message: 1,
              createdAt: 1, // Include only roomId, message, and createdAt
            },
          },
        ],
        as: 'lastMessage',
      },
    },
    {
      $addFields: {
        lastMessage: { $arrayElemAt: ['$lastMessage', 0] }, // Extract the single last message
      },
    },
    {
      $project: {
        'group1.invite.password': 0, // Exclude sensitive fields from group1 invite
        'group2.invite.password': 0, // Exclude sensitive fields from group2 invite
      },
    },
  ]);

  return chatGroups;
};

/*
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

*/

export const chatGroupServices = {
  allUserChattingGroup,
  chatGroupList,
};
