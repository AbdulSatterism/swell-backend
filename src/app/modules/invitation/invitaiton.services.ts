/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Invitation } from './invitation.model';
import { ChatGroup } from '../chatGroup/chatGroup.model';
import { Group } from '../group/group.model';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';

const sendInvitaioin = async (
  senderGroupId: string,
  receiverGroupId: string,
) => {
  const senderGroup = await Group.findById({ _id: senderGroupId });
  const receiverGroup = await Group.findById({ _id: receiverGroupId });

  if (!senderGroup) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Inviter Group not found');
  }

  if (!receiverGroup) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'invited Group not found');
  }

  //@ts-ignore
  const socketIo = global.io;

  const result = await Invitation.create({
    senderGroupId,
    receiverGroupId,
    status: 'PENDING',
  });

  receiverGroup.invite.forEach(memberId => {
    socketIo.emit(`group-invitation:${memberId}`, {
      senderGroupId,
      invitationId: result?._id,
      senderGroupName: senderGroup.groupName,
      receiverGroupName: receiverGroup.groupName,
    });
  });

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

    if (!chatGroup) {
      chatGroup = await ChatGroup.create({
        group1: senderGroupId,
        group2: receiverGroupId,
      });
    }

    const chatRoom = `${senderGroupId}-${receiverGroupId}`;
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
