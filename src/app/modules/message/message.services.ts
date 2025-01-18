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

  await Message.updateMany({ roomId: roomId, read: false }, { read: true });

  // Return paginated result
  return {
    totalMessages,
    totalPages,
    currentPage: Number(page),
    limit: Number(limit),
    messages,
  };
};

// const totalUnreadMessageSpecificGroup = async (roomId: string) => {
//   const existChatGroup = await ChatGroup.findOne({ roomId });

//   if (!existChatGroup) {
//     throw new ApiError(StatusCodes.NOT_FOUND, 'this chat group not found');
//   }

//   // Find messages in the room with 'read' field set to false
//   const unreadCount = await Message.countDocuments({ roomId, read: false });

//   // Return the total count of unread messages
//   return unreadCount;
// };

const totalUnreadMessageSpecificGroup = async (groupId: string) => {
  // Step 1: Find the chat groups where the given groupId is part of group1 or group2
  const chatGroups = await ChatGroup.find({
    $or: [{ group1: groupId }, { group2: groupId }],
  });

  // Step 2: Extract all roomIds from the matched chat groups
  const roomIds = chatGroups.map(group => group.roomId);

  // Step 3: Count unread messages for the matched roomIds
  const unreadCount = await Message.aggregate([
    {
      $match: {
        roomId: { $in: roomIds }, // Match messages with roomIds from chat groups
        read: false, // Only unread messages
      },
    },
    {
      $count: 'totalUnreadMessages', // Count the unread messages
    },
  ]);

  // Return the count (default to 0 if no messages found)
  return unreadCount.length > 0 ? unreadCount[0].totalUnreadMessages : 0;
};

// const totalUnreadMessageSpecificGroup = async (groupId: string) => {
//   const unreadCount = await ChatGroup.aggregate([
//     // Step 1: Match chat groups where groupId is part of group1 or group2
//     {
//       $match: {
//         $or: [{ group1: groupId }, { group2: groupId }],
//       },
//     },
//     // Step 2: Lookup messages for the matched chat groups
//     {
//       $lookup: {
//         from: 'messages', // The Message collection
//         localField: 'roomId', // roomId in ChatGroup
//         foreignField: 'roomId', // roomId in Message
//         as: 'messages', // Resulting array of messages
//       },
//     },
//     // Step 3: Unwind the messages array to work with individual messages
//     {
//       $unwind: '$messages',
//     },
//     // Step 4: Filter only unread messages
//     {
//       $match: {
//         'messages.read': false,
//       },
//     },
//     // Step 5: Count the total unread messages
//     {
//       $count: 'totalUnreadMessages',
//     },
//   ]);

//   // Return the total count or default to 0 if no messages found
//   return unreadCount.length > 0 ? unreadCount[0].totalUnreadMessages : 0;
// };

export const messageServices = {
  createMessageIntoGroup,
  showAllMessageSpeceficGroup,
  totalUnreadMessageSpecificGroup,
};
