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

export const invitationService = {
  sendInvitaioin,
  responseInvitation,
};

/*

// const sendInvitaioin = async (payload: TInvitation) => {
//   const result = await Invitation.create(payload);

//   if (result.status === 'PENDING') {
//     const data = {
//       text: `You have invited `,
//       receiver: payload.receiverGroupId,
//     };

//     await sendNotifications(data);
//   }

//   return result;
// };

// const updatedInvite = async (id: string, payload: TInvitation) => {
//   const result = await Invitation.findByIdAndUpdate(
//     { _id: id },
//     { status: 'ACCEPTED' },
//     { new: true },
//   );

//   const value = {
//     group1: payload.senderGroupId,
//     group2: payload.receiverGroupId,
//   };

//   await ChatGroup.create(value);

//   return result;
// };

*/
