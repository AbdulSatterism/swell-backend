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

// const showAllMessageSpeceficGroup = async (
//   roomId: string,
//   limit: number,
//   page: number,
// ) => {
//   const existChatGroup = await ChatGroup.findOne({ roomId });

//   if (!existChatGroup) {
//     throw new ApiError(StatusCodes.NOT_FOUND, 'this chat group not found');
//   }

//   const messages = await Message.find({ roomId })
//     .populate('senderId', 'name email image') // Populate sender details (e.g., name, email)
//     .sort({ createdAt: 1 });

//   // await Message.updateMany({ roomId: roomId, read: false }, { read: true });

//   return messages;
// };

const showAllMessageSpeceficGroup = async (
  roomId: string,
  query: { limit: number; page: number },
) => {
  const { limit, page } = query;
  // Check if the chat group exists
  const existChatGroup = await ChatGroup.findOne({ roomId });

  if (!existChatGroup) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'This chat group not found');
  }

  // Pagination logic
  const skip = (page - 1) * limit;

  // Fetch total count of messages
  const totalMessages = await Message.countDocuments({ roomId });

  // Fetch messages with pagination
  const messages = await Message.find({ roomId })
    .populate('senderId', 'name email image') // Populate sender details (e.g., name, email)
    .sort({ createdAt: -1 }) // Sort by latest messages
    .skip(skip) // Skip documents for pagination
    .limit(limit); // Limit the number of documents

  // Calculate total pages
  const totalPages = Math.ceil(totalMessages / limit);

  // Return paginated result
  return {
    totalMessages,
    totalPages,
    currentPage: Number(page),
    limit: Number(limit),
    messages,
  };
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
