/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { TMessage } from './message.interface';
import { Message } from './message.model';
import { User } from '../user/user.model';
import { ChatGroup } from '../chatGroup/chatGroup.model';

const createMessageIntoGroup = async (payload: TMessage) => {
  const userExist = await User.findById(payload.senderId);

  if (!userExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'user not found');
  }

  //@ts-ignore
  const socketIo = global.io;

  //roomId will be between two group id => senderGroupId-receiverGroupId like 12456-254782
  const chatRoom = payload.roomId;

  //emit the message to the specific
  socketIo.emit(`new-message:${chatRoom}`, {
    senderId: payload.senderId,
    message: payload.message,
  });

  //after sending message to socket we will save the message in database
  const newMessage = await Message.create(payload);

  return newMessage; // Return the result after successful creation
};

const showAllMessageSpeceficGroup = async (roomId: string) => {
  const existChatGroup = await ChatGroup.findOne({ roomId });

  if (!existChatGroup) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'this chat group not found');
  }

  const messages = await Message.find({ roomId })
    .populate('senderId', 'name email image') // Populate sender details (e.g., name, email)
    .sort({ createdAt: 1 });

  // update the read field to true or false by groupId and roomId with splite

  // let id: any = [];
  // messages.forEach(message => {
  //   id.push(message.groupId);
  // });
  // console.log(id);

  // const parts = roomId.split('-');

  // const chatGroupIdOne = parts[0];
  // const chatGroupIdOne = parts[0];
  // const chatGroupIdTwo = parts[1];

  // for (const message of messages) {
  //   if (message.groupId.toString() === chatGroupIdOne) {
  //     const id = new mongoose.Types.ObjectId(message.groupId);
  //     // Update read to true for all messages with groupId matching chatGroupIdOne
  //     await Message.updateMany(
  //       {
  //         groupId: { $in: [id] },
  //       },
  //       { $set: { read: true } },
  //     );
  //   }

  //   if (message.groupId.toString() === chatGroupIdTwo) {
  //     // Update read to true for all messages with groupId matching chatGroupIdTwo
  //     // await Message.updateMany(
  //     //   { groupId: message.groupId },
  //     //   { $set: { read: true } },
  //     // );

  //     const id = new mongoose.Types.ObjectId(message.groupId);
  //     // Update read to true for all messages with groupId matching chatGroupIdOne
  //     await Message.updateMany(
  //       {
  //         groupId: { $in: [id] },
  //       },
  //       { $set: { read: true } },
  //     );
  //   }
  // }

  // messages.filter(async message => {
  //   if (message.groupId.toString() === chatGroupIdOne) {
  //     await Message.updateMany({ groupId: message.groupId }, { read: true });
  //   }
  //   if (message.groupId.toString() === chatGroupIdTwo) {
  //     await Message.updateMany({ groupId: message.groupId }, { read: true });
  //   }
  // });

  // console.log(allMatchChatGroupIdOne);

  // if message is read then update the read field to true
  await Message.updateMany({ roomId: roomId, read: false }, { read: true });

  return messages;
};

const totalUnreadMessageSpecificGroup = async (roomId: string) => {
  const existChatGroup = await ChatGroup.findOne({ roomId });

  if (!existChatGroup) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'this chat group not found');
  }

  // Find messages in the room with 'read' field set to false
  const unreadCount = await Message.countDocuments({ roomId, read: false });

  // Return the total count of unread messages
  return unreadCount;
};

export const messageServices = {
  createMessageIntoGroup,
  showAllMessageSpeceficGroup,
  totalUnreadMessageSpecificGroup,
};
