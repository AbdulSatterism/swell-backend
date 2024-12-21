import { model, Schema } from 'mongoose';
import { TChat } from './chatGroup.interface';

// const chatSchema = new Schema<TChat>(
//   {
//     fromGroup: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
//     toGroup: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
//     content: { type: String, required: true },
//   },
//   {
//     timestamps: true,
//   },
// );

const chatSchema = new Schema<TChat>({
  group1: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
  group2: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
});

export const ChatGroup = model<TChat>('ChatGroup', chatSchema);
