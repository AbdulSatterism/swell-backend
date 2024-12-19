/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Invitation } from './invitation.model';
import { sendNotifications } from '../../../helpers/notificationHelper';
import { TInvitation } from './invitaion.interface';
import { ChatGroup } from '../chatGroup/chatGroup.model';

// const sendInvitaioin = async (
//   senderGroupId: string,
//   receiverGroupId: string,
// ) => {
//   const senderGroup = await Group.findById({ _id: senderGroupId });
//   const receiverGroup = await Group.findById({ _id: receiverGroupId });

//   if (!senderGroup) {
//     throw new ApiError(StatusCodes.NOT_FOUND, 'Inviter Group not found');
//   }

//   if (!receiverGroup) {
//     throw new ApiError(StatusCodes.NOT_FOUND, 'invited Group not found');
//   }

//   //@ts-ignore
//   const socketIo = global.io;

//   socketIo.to(receiverGroup.createdBy).emit('group-invitation', {
//     senderGroupId,
//     senderGroupName: senderGroup.groupName,
//   });

//   receiverGroup.invite.forEach(memberId => {
//     socketIo.to(memberId).emit('group-invitation', {
//       senderGroupId,
//       senderGroupName: senderGroup.groupName,
//     });
//   });

//   const result = await Invitation.create({
//     senderGroupId,
//     receiverGroupId,
//     status: 'PENDING',
//   });

//   return result;
// };

const sendInvitaioin = async (payload: TInvitation) => {
  const result = await Invitation.create(payload);

  if (result.status === 'PENDING') {
    const data = {
      text: `You have invited `,
      receiver: payload.receiverGroupId,
    };

    await sendNotifications(data);
  }

  return result;
};

const updatedInvite = async (id: string, payload: TInvitation) => {
  const result = await Invitation.findByIdAndUpdate(
    { _id: id },
    { status: 'ACCEPTED' },
    { new: true },
  );

  const value = {
    group1: payload.senderGroupId,
    group2: payload.receiverGroupId,
  };

  await ChatGroup.create(value);

  return result;
};

export const invitationService = {
  sendInvitaioin,
  updatedInvite,
};
