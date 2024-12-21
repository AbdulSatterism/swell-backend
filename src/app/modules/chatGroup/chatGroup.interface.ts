import { Types } from 'mongoose';

export type TChat = {
  group1: Types.ObjectId;
  group2: Types.ObjectId;
};

// export type TChat = {
//   fromGroup: Types.ObjectId;
//   toGroup: Types.ObjectId;
//   content: string;
// };
