import colors from 'colors';
import { Server } from 'socket.io';
import { logger } from '../shared/logger';

const socket = (io: Server) => {
  io.on('connection', socket => {
    console.log('A user connected:', socket.id);
    socket.on('join', roomId => {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
    });

    //disconnect
    socket.on('disconnect', () => {
      logger.info(colors.red('A user disconnect'));
    });
  });
};

export const socketHelper = { socket };
