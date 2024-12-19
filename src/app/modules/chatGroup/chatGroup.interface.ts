import { Types } from 'mongoose';

export type TChat = {
  group1: Types.ObjectId;
  group2: Types.ObjectId;
  messages: {
    senderId: Types.ObjectId;
    message: string;
    timestamp: Date;
  }[];
};
