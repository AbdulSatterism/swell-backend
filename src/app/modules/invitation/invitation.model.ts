import { model, Schema } from 'mongoose';
import { TInvitation } from './invitaion.interface';

const invitationSchema = new Schema<TInvitation>({
  senderGroupId: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  },
  receiverGroupId: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
    default: 'PENDING',
  },
});

export const Invitation = model<TInvitation>('Invitation', invitationSchema);
