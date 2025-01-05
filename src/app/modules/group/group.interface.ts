import { Types } from 'mongoose';

export type TGroup = {
  groupName?: string;
  createdBy: Types.ObjectId;
  invite: Types.ObjectId[];
  coverPhoto: string;
  address: string;
  bio: string;
  description: string;
  gender: 'MALE' | 'FEMALE' | 'OTHERS';
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
};
