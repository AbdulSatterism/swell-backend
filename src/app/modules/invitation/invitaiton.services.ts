/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Invitation } from './invitation.model';
import { ChatGroup } from '../chatGroup/chatGroup.model';
import { Group } from '../group/group.model';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import { User } from '../user/user.model';
import { Notification } from '../notifications/notifications.model';
import mongoose from 'mongoose';
import { group } from 'console';

const sendInvitaioin = async (
  senderGroupId: string,
  receiverGroupId: string,
  id: string,
) => {
  const senderGroup = await Group.findById({ _id: senderGroupId });
  const receiverGroup = await Group.findById({ _id: receiverGroupId });
  const existUser = await User.findById(id);

  if (!existUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'this user not found');
  }

  if (!senderGroup) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Inviter Group not found');
  }

  if (!receiverGroup) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'invited Group not found');
  }

  //@ts-ignore
  const socketIo = global.io;

  // if already have an invitaion then don't create invitaion for this group only send invitation message

  const existSameGroupInvitation = await Invitation.findOne({
    $and: [
      { senderGroupId: senderGroupId },
      { receiverGroupId: receiverGroupId },
    ],
  });

  if (existSameGroupInvitation) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'already send invitaion');
  }

  // if database has no invitaiton for this group then create other wise

  const result = await Invitation.create({
    senderGroupId,
    receiverGroupId,
    userId: existUser._id,
    status: 'PENDING',
  });

  receiverGroup.invite.forEach(memberId => {
    socketIo.emit(`group-invitation:${memberId}`, {
      senderGroupId,
      invitationId: result?._id,
      userId: existUser?._id,
      message: `you got a group invitation from this group ${result?._id}`,
    });
  });

  // after send notification save notificaion in database
  // create notification
  const notificationPayload = {
    userId: existUser?._id,
    senderGroupId,
    receiverGroupId,
    invitationId: result?._id,
    message: `you got a group invitation from this group ${result?._id}`,
  };

  await Notification.create(notificationPayload);

  return result;
};

const responseInvitation = async (invitationId: string, response: string) => {
  const existInvitation = await Invitation.findById(invitationId);

  if (!existInvitation) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'invitation not found');
  }

  const { senderGroupId, receiverGroupId, _id } = existInvitation;

  if (response === 'REJECTED') {
    await Invitation.findByIdAndUpdate(
      { _id },
      { status: 'REJECTED' },
      { new: true },
    );
  }

  //@ts-ignore
  const socketIo = global.io;

  let chatGroup;

  if (response === 'ACCEPTED') {
    // update invitation status =>
    await Invitation.findByIdAndUpdate(
      { _id },
      { status: 'ACCEPTED' },
      { new: true },
    );

    chatGroup = await ChatGroup.findOne({
      group1: senderGroupId,
      group2: receiverGroupId,
    });

    const chatRoom = `${senderGroupId}-${receiverGroupId}`;

    if (!chatGroup) {
      chatGroup = await ChatGroup.create({
        group1: senderGroupId,
        group2: receiverGroupId,
        roomId: chatRoom,
      });
    }

    socketIo.emit(`chat-started:${chatRoom}`, {
      chatRoom,
      message: 'Chat started between the groups.',
    });
  }

  return chatGroup;
};

const getUserInvitation = async (userId: string) => {
  const existUser = await User.findById(userId);

  if (!existUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'this user not found');
  }
  const userIdObjectId = new mongoose.Types.ObjectId(userId);

  const invitations = await Invitation.aggregate([
    // Lookup to join the Group collection
    {
      $lookup: {
        from: 'groups',
        localField: 'receiverGroupId',
        foreignField: '_id',
        as: 'receiverGroup',
      },
    },
    // Unwind the receiverGroup array
    {
      $unwind: '$receiverGroup',
    },
    // Match documents where the user exists in receiverGroup.invite
    {
      $match: {
        'receiverGroup.invite': userIdObjectId,
      },
    },
    // Lookup to populate userId
    {
      $lookup: {
        from: 'users', // The name of the User collection
        localField: 'userId', // Field in Invitation
        foreignField: '_id', // Field in User
        as: 'user', // Name of the joined field
      },
    },

    {
      $lookup: {
        from: 'groups',
        localField: 'senderGroupId',
        foreignField: '_id',
        as: 'senderGroup',
      },
    },
    // Unwind the senderGroup array
    {
      $unwind: {
        path: '$senderGroup',
        preserveNullAndEmptyArrays: true, // Allows handling of cases where senderGroupId may not exist
      },
    },
    // Unwind the user array
    {
      $unwind: {
        path: '$user',
        preserveNullAndEmptyArrays: true, // Allows handling of cases where userId may not exist
      },
    },

    // Project fields to simplify the output
    {
      $project: {
        _id: 1,
        senderGroup: 1,
        receiverGroupId: 1,
        'user._id': 1, // Include user details
        'user.name': 1,
        'user.email': 1,
        'user.image': 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);
  return invitations;
};

const getGroupInvitation = async (groupId: string) => {
  const existGroup = await Group.findById(groupId);

  if (!existGroup) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'group not found');
  }

  const groupObjectId = new mongoose.Types.ObjectId(groupId);

  const invitations = await Invitation.find({
    receiverGroupId: groupObjectId,
  }).populate('senderGroupId receiverGroupId userId');

  return invitations;
};

export const invitationService = {
  sendInvitaioin,
  responseInvitation,
  getUserInvitation,
  getGroupInvitation,
};
