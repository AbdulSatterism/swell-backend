/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { TMessage } from './message.interface';
import { Message } from './message.model';
import { User } from '../user/user.model';

const createMessageIntoGroup = async (payload: TMessage) => {
  const userExist = await User.findById(payload.senderId);

  if (!userExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'user not found');
  }

  //@ts-ignore
  const socketIo = global.io;

  //roomId will be between two group id => senderGroupId-receiverGroupId like 12456-254782
  const chatRoom = payload.roomId;

  const newMessage = await Message.create(payload);

  socketIo.emit(`new-message:${chatRoom}`, {
    senderId: payload.senderId,
    message: payload.message,
  });

  return newMessage; // Return the result after successful creation
};

export const messageServices = {
  createMessageIntoGroup,
};
