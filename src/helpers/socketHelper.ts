/* eslint-disable no-console */
import colors from 'colors';
import { Server } from 'socket.io';
import { logger } from '../shared/logger';

const socket = (io: Server) => {
  io.on('connection', socket => {
    console.log('A user connected:', socket.id);

    socket.on('join', roomId => {
      // Join the chat room with format 'group1-group2'
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
    });

    // Listen for new messages
    socket.on(`new-message`, ({ chatRoom, senderId, message }) => {
      // Using exact format from your message creation code
      io.emit(`new-message:${chatRoom}`, {
        senderId,
        message,
      });
    });

    // Listen for chat start event
    socket.on('chat-started', ({ chatRoom }) => {
      // Using exact format from your invitation response code
      io.emit(`chat-started:${chatRoom}`, {
        chatRoom,
        message: 'Chat started between the groups.',
      });
    });

    //disconnect
    socket.on('disconnect', () => {
      logger.info(colors.red('A user disconnect'));
    });
  });
};

export const socketHelper = { socket };
