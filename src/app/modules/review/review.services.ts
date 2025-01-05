// import { StatusCodes } from 'http-status-codes';
// import ApiError from '../../../errors/ApiError';
// import { TReview } from './review.interface';
// import { Review } from './review.model';
// import { User } from '../user/user.model';

// const createReview = async (payload: TReview) => {
//   const { userId } = payload;

//   //   const isExistUser = await User.isExistUserById(userId as unknown as string);
//   //   if (!isExistUser) {
//   //     throw new ApiError(StatusCodes.NOT_FOUND, 'user not found');
//   //   }
//   const result = await Review.create(payload);

//   return result;
// };

// // const getAllSetting = async () => {
// //   const result = await Setting.find();

// //   return result;
// // };

// // const updateSetting = async (payload: TSetting) => {
// //   const result = await Setting.findOneAndUpdate(
// //     {},
// //     { description: payload.description },
// //     { new: true },
// //   );

// //   return result;
// // };

// export const settingServices = {
//   createSetting: createReview,
//   //   getAllSetting,
// };
