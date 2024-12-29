/* eslint-disable no-console */
import colors from 'colors';
import { Server } from 'socket.io';
import { logger } from '../shared/logger';

const socket = (io: Server) => {
  /*
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

  */

  io.on('connection', socket => {
    console.log('A user connected:', socket.id);

    // Join a chat room
    socket.on('join', roomId => {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
    });

    // Listen for new messages and emit to the specific chat room
    socket.on('new-message', ({ chatRoom, senderId, message }) => {
      // Emit message to the specific chat room
      io.to(chatRoom).emit(`new-message:${chatRoom}`, {
        senderId,
        message,
      });
    });

    // Listen for the chat-started event and emit to the specific room
    socket.on('chat-started', ({ chatRoom }) => {
      io.to(chatRoom).emit(`chat-started:${chatRoom}`, {
        chatRoom,
        message: 'Chat started between the groups.',
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(colors.red('A user disconnect'));
    });
  });
};

export const socketHelper = { socket };
