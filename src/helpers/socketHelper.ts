/* eslint-disable no-console */
// import colors from 'colors';
import { Server } from 'socket.io';
// import { logger } from '../shared/logger';
import { Message } from '../app/modules/message/message.model';

/*
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

/*
  io.on('connection', socket => {
    console.log('A user connected:', socket.id);

    // Join a chat room
    socket.on('join', roomId => {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
    });

    // Listen for new messages and emit to the specific chat room
    socket.on(`new-message:$`, ({ chatRoom, senderId, message }) => {
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
*/

const socket = (io: Server) => {
  io.on('connection', socket => {
    console.log('A user connected:', socket.id);

    // Join a chat room
    socket.on('join', roomId => {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
    });

    // Listen for new messages and handle real-time broadcasting and storage
    // socket.on('new-message', async ({ roomId, senderId, message }) => {
    //   try {
    //     // Emit message to all users in the specified chat room
    //     io.emit(`new-message:${roomId}`, {
    //       senderId,
    //       message,
    //     });

    //     // Save the message to the database
    //     const newMessage = await Message.create({
    //       roomId,
    //       senderId,
    //       message,
    //     });

    //     console.log(newMessage);

    //     console.log(`Message saved to DB: ${newMessage}`);
    //   } catch (error) {
    //     console.error('Error saving message:', error);
    //   }
    // });

    // socket.on(`send-message`, async ({ roomId, senderId, message }) => {
    //   // Emit message to all users in the specified chat room

    //   // Save the message to the database
    //   const msg = await Message.create({
    //     roomId,
    //     senderId,
    //     message,
    //   }).populate('senderId', 'name email image');

    //   io.emit(`receive-message:${msg.roomId}`, msg);
    // });

    socket.on('send-message', async ({ roomId, senderId, message }) => {
      try {
        // Save the message to the database
        const newMessage = await Message.create({
          roomId,
          senderId,
          message,
        });

        // Populate the senderId field
        const populatedMessage = await newMessage.populate(
          'senderId',
          'name email image',
        );

        // Emit the message to all users in the specified chat room
        io.emit(`receive-message:${populatedMessage.roomId}`, populatedMessage);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    // // Listen for the chat-started event and emit to the specific room
    // socket.on('chat-started', ({ chatRoom }) => {
    //   io.to(chatRoom).emit(`chat-started:${chatRoom}`, {
    //     chatRoom,
    //     message: 'Chat started between the groups.',
    //   });
    // });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });
};

export default socket;

export const socketHelper = { socket };
