import { Model } from 'mongoose';

export type IUser = {
  name: string;
  email: string;
  phone: string;
  role: 'ADMIN' | "USER";
  gender:"MALE"|'FEMALE'|'OTHERS';
  birthday:string;
  password: string;
  address?: string;
  image?: string;
  school?: string;
  instagram?: string;
  status: 'active' | 'delete';
  groupLimit?:number;
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  };
  verified: boolean;
};

export type UserModal = {
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isAccountCreated(id: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;
