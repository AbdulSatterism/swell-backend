/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { ChatGroup } from '../chatGroup/chatGroup.model';
import { TMessage } from './message.interface';
import { Message } from './message.model';
import { User } from '../user/user.model';
import mongoose from 'mongoose';

const createMessageIntoGroup = async (payload: TMessage) => {
  // const chatGroupExist = await ChatGroup.findById({});
  const chatGroupExist = await ChatGroup.findOne({
    $or: [{ group1: payload.chatGroupId }, { group2: payload.chatGroupId }],
  });

  const userExist = await User.findById(payload.senderId);

  if (!chatGroupExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'chat group not fond');
  }

  if (!userExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'user not found');
  }

  //@ts-ignore
  const socketIo = global.io;

  // Start a session for the transaction
  const session = await mongoose.startSession();

  try {
    // Start a transaction
    session.startTransaction();

    const newMessage = await Message.create([payload], { session });

    const chatRoom = `${chatGroupExist.group1}-${chatGroupExist.group2}`;
    socketIo.emit(`new-message:${chatRoom}`, {
      senderId: payload.senderId,
      message: payload.message,
    });

    // Commit the transaction
    await session.commitTransaction();

    return newMessage; // Return the result after successful creation
  } catch (error) {
    // If any error occurs, abort the transaction
    await session.abortTransaction();
    throw error;
  } finally {
    // End the session
    session.endSession();
  }
};

// export async function sendMessage(req: Request, res: Response, io: Server) {
//   try {
//     const { chatGroupId, senderId, message } = req.body;

//     return res.status(200).json(newMessage);
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// }

export const messageServices = {
  createMessageIntoGroup,
};
