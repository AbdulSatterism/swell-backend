import { TGroup } from './group.interface';
import { User } from '../user/user.model';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import { Group } from './group.model';
import mongoose from 'mongoose';
import { HiddenGroup } from '../hiddenGroup/hiddenGroup.model';
import { AcceptedGroup } from '../acceptedGroup/acceptedGroup.model';
import unlinkFile from '../../../shared/unlinkFile';

const createGroupIntoDB = async (userId: string, payload: Partial<TGroup>) => {
  const { createdBy, invite } = payload;

  if (!invite) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Group member empty');
  }

  if (invite.length > 6) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'invited member can not be more than 6',
    );
  }

  const isExistUser = await User.isExistUserById(
    createdBy as unknown as string,
  );

  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Main user not found');
  }

  if (!isExistUser._id.equals(userId)) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'This is not right user for create this group',
    );
  }

  // Start a session for the transaction
  const session = await mongoose.startSession();

  try {
    // Start a transaction
    session.startTransaction();

    // Check if the user has reached their group limit
    if (isExistUser.groupLimit >= 3) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'This user group limit is over, already created 3 groups',
      );
    }

    // Create the group in the database
    const result = await Group.create([payload], { session });

    // Increment the user's group limit (atomic update within the transaction)
    await User.findByIdAndUpdate(
      { _id: createdBy },
      { $inc: { groupLimit: 1 } },
      { new: true, session },
    );

    // Commit the transaction
    await session.commitTransaction();

    return result; // Return the result after successful creation
  } catch (error) {
    // If any error occurs, abort the transaction
    await session.abortTransaction();
    throw error;
  } finally {
    // End the session
    session.endSession();
  }
};

const getSingleGroup = async (groupId: string) => {
  const result = await Group.findById({ _id: groupId }).populate({
    path: 'invite createdBy',
    select: 'name image email',
  });

  return result;
};

const updateGroupProfile = async (
  groupId: string,
  payload: Partial<TGroup>,
) => {
  const groupExist = await Group.findById({ _id: groupId });

  if (!groupExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Group not found');
  }

  if (groupExist) {
    unlinkFile(groupExist.coverPhoto);
  }

  // update group profile

  const result = await Group.findByIdAndUpdate({ _id: groupId }, payload, {
    new: true,
  });

  return result;
};

const allGroupSpecificUser = async (userId: string) => {
  const isExistUser = await User.isExistUserById(userId);

  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'this user not found');
  }

  // const specificUserGroup = await Group.find({ createdBy: userId }).populate({
  //   path: 'invite',
  //   select: 'name image email',
  // });

  const specificUserGroup = await Group.find({
    $or: [
      { createdBy: userId }, // User is the creator
      { invite: userId }, // User is in the invite array
    ],
  }).populate({
    path: 'invite',
    select: 'name image email', // Include only specific fields for invite
  });

  return specificUserGroup;
};

const myAllJoinedGroup = async (userId: string) => {
  const isExistUser = await User.isExistUserById(userId);

  if (!isExistUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'this user not found');
  }

  const addedGroups = await Group.find({
    invite: userId,
  }).populate({
    path: 'invite',
    select: 'name image email',
  });

  if (!addedGroups.length) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'this user not added any group yet!!',
    );
  }

  return addedGroups;
};

// const getNearestAllGroup = async (groupId: string, userId: string) => {
//   // Find the reference group by groupId
//   const existGroup = await Group.findById(groupId);

//   if (!existGroup) {
//     throw new ApiError(StatusCodes.NOT_FOUND, 'Group not found');
//   }

//   const userObjectId = new mongoose.Types.ObjectId(userId);

//   // Extract longitude and latitude from the reference group's location
//   const longitude = existGroup.location.coordinates[0];
//   const latitude = existGroup.location.coordinates[1];

//   // Fetch hidden groups for the given groupId
//   const hiddenGroups = await HiddenGroup.find({
//     hiddenByGroupId: groupId,
//   }).select('hiddenGroupId');
//   const hiddenGroupIds = hiddenGroups.map(doc => doc.hiddenGroupId);

//   // Fetch accepted groups for the given groupId
//   const acceptedGroups = await AcceptedGroup.find({
//     acceptedByGroupId: groupId,
//   }).select('acceptedGroupId');
//   const acceptedGroupIds = acceptedGroups.map(doc => doc.acceptedGroupId);

//   const excludedGroupIds = [...hiddenGroupIds, ...acceptedGroupIds];

//   // Perform geospatial aggregation to find nearby groups, exclude groups with the userId in invite[],
//   // and exclude hidden groups
//   const nearestGroups = await Group.aggregate([
//     {
//       $geoNear: {
//         near: {
//           type: 'Point',
//           coordinates: [longitude, latitude],
//         },
//         distanceField: 'distance',
//         spherical: true,
//         distanceMultiplier: 0.001, // Convert meters to kilometers
//       },
//     },
//     {
//       $match: {
//         _id: { $nin: excludedGroupIds }, // Exclude hidden groups
//         invite: { $ne: userObjectId }, // Exclude groups where invite[] contains userId
//       },
//       // $match: {
//       //   _id: { $nin: hiddenGroupIds }, // Exclude hidden groups
//       //   invite: { $ne: userObjectId }, // Exclude groups where invite[] contains userId
//       // },
//     },
//     {
//       $lookup: {
//         from: 'users', // The name of the collection to join with
//         localField: 'invite', // Field in the current collection (Group) that holds references
//         foreignField: '_id', // Field in the foreign collection (User) that matches
//         as: 'invite', // Name of the new field to add the populated data
//         pipeline: [
//           {
//             $project: {
//               password: 0, // Exclude the password field
//             },
//           },
//         ],
//       },
//     },
//     {
//       $project: {
//         groupName: 1,
//         createdBy: 1,
//         invite: 1,
//         coverPhoto: 1,
//         address: 1,
//         bio: 1,
//         gender: 1,
//         location: 1,
//         distance: 1,
//         createdAt: 1,
//         updatedAt: 1,
//       },
//     },
//     {
//       $sort: { distance: 1 }, // Sort groups by distance (closest first)
//     },
//   ]);

//   return nearestGroups;
// };

// const getNearestAllGroup = async (groupId: string, userId: string) => {
//   // Find the reference group by groupId
//   const existGroup = await Group.findById(groupId);

//   if (!existGroup) {
//     throw new ApiError(StatusCodes.NOT_FOUND, 'Group not found');
//   }

//   const userObjectId = new mongoose.Types.ObjectId(userId);

//   // Extract longitude and latitude from the reference group's location
//   const longitude = existGroup.location.coordinates[0];
//   const latitude = existGroup.location.coordinates[1];

//   // Fetch hidden groups for the given groupId
//   const hiddenGroups = await HiddenGroup.find({
//     hiddenByGroupId: groupId,
//   }).select('hiddenGroupId');
//   const hiddenGroupIds = hiddenGroups.map(doc => doc.hiddenGroupId);

//   // Fetch accepted groups for the given groupId
//   const acceptedGroups = await AcceptedGroup.find({
//     acceptedByGroupId: groupId,
//   }).select('acceptedGroupId');
//   const acceptedGroupIds = acceptedGroups.map(doc => doc.acceptedGroupId);

//   const excludedGroupIds = [...hiddenGroupIds, ...acceptedGroupIds];

//   // Perform geospatial aggregation to find nearby groups
//   const nearestGroups = await Group.aggregate([
//     {
//       $geoNear: {
//         near: {
//           type: 'Point',
//           coordinates: [longitude, latitude],
//         },
//         distanceField: 'distance',
//         spherical: true,
//         distanceMultiplier: 0.001, // Convert meters to kilometers
//       },
//     },
//     {
//       $match: {
//         _id: { $nin: excludedGroupIds }, // Exclude hidden and accepted groups
//         invite: { $ne: userObjectId }, // Exclude groups where invite[] contains userId
//         ...(existGroup.lookingFor && { gender: existGroup.lookingFor }), // Filter by gender based on lookingFor
//       },
//     },
//     {
//       $lookup: {
//         from: 'users', // The name of the collection to join with
//         localField: 'invite', // Field in the current collection (Group) that holds references
//         foreignField: '_id', // Field in the foreign collection (User) that matches
//         as: 'invite', // Name of the new field to add the populated data
//         pipeline: [
//           {
//             $project: {
//               password: 0, // Exclude the password field
//             },
//           },
//         ],
//       },
//     },
//     {
//       $project: {
//         groupName: 1,
//         createdBy: 1,
//         invite: 1,
//         coverPhoto: 1,
//         address: 1,
//         bio: 1,
//         gender: 1,
//         location: 1,
//         distance: 1,
//         createdAt: 1,
//         updatedAt: 1,
//       },
//     },
//     {
//       $sort: { distance: 1 }, // Sort groups by distance (closest first)
//     },
//   ]);

//   return nearestGroups;
// };

const getNearestAllGroup = async (
  groupId: string,
  userId: string,
  page: number = 1, // Default to the first page
  limit: number = 1, // Default to 10 groups per page
) => {
  // Find the reference group by groupId
  const existGroup = await Group.findById(groupId);

  if (!existGroup) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Group not found');
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Extract longitude and latitude from the reference group's location
  const longitude = existGroup.location.coordinates[0];
  const latitude = existGroup.location.coordinates[1];

  // Fetch hidden groups for the given groupId
  const hiddenGroups = await HiddenGroup.find({
    hiddenByGroupId: groupId,
  }).select('hiddenGroupId');
  const hiddenGroupIds = hiddenGroups.map(doc => doc.hiddenGroupId);

  // Fetch accepted groups for the given groupId
  const acceptedGroups = await AcceptedGroup.find({
    acceptedByGroupId: groupId,
  }).select('acceptedGroupId');
  const acceptedGroupIds = acceptedGroups.map(doc => doc.acceptedGroupId);

  const excludedGroupIds = [...hiddenGroupIds, ...acceptedGroupIds];

  // Calculate pagination values
  const skip = (page - 1) * limit;

  // Perform geospatial aggregation to find nearby groups with filtering and pagination
  const nearestGroups = await Group.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        distanceField: 'distance',
        spherical: true,
        distanceMultiplier: 0.001, // Convert meters to kilometers
      },
    },
    {
      $match: {
        _id: { $nin: excludedGroupIds }, // Exclude hidden and accepted groups
        invite: { $ne: userObjectId }, // Exclude groups where invite[] contains userId
        $expr: {
          $eq: ['$gender', existGroup.lookingFor], // Dynamically filter based on existGroup.lookingFor
        },
      },
    },
    {
      $lookup: {
        from: 'users', // The name of the collection to join with
        localField: 'invite', // Field in the current collection (Group) that holds references
        foreignField: '_id', // Field in the foreign collection (User) that matches
        as: 'invite', // Name of the new field to add the populated data
        pipeline: [
          {
            $project: {
              password: 0, // Exclude the password field
            },
          },
        ],
      },
    },
    {
      $project: {
        groupName: 1,
        createdBy: 1,
        invite: 1,
        coverPhoto: 1,
        address: 1,
        bio: 1,
        gender: 1,
        location: 1,
        distance: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
    {
      $sort: { distance: 1 }, // Sort groups by distance (closest first)
    },
    {
      $skip: skip, // Skip groups for pagination
    },
    {
      $limit: limit, // Limit the number of groups returned
    },
  ]);

  return nearestGroups;
};

const leaveFromGroup = async (groupId: string, userId: string) => {
  const isExistUser = await User.isExistUserById(userId);

  const existGroup = await Group.findById(groupId);

  if (!isExistUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'this user not found');
  }

  if (!existGroup) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'this group not found');
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);

  if (!existGroup.invite.includes(userObjectId)) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'User is not a member of this group.',
    );
  }

  // console.log(existGroup.createdBy.toString() === userObjectId.toString());

  if (existGroup.createdBy.toString() === userObjectId.toString()) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Sorry you created this group. you can't leave!!",
    );
  }

  const updatedGroup = await Group.findByIdAndUpdate(
    groupId,
    { $pull: { invite: userObjectId } },
    { new: true }, // Return the updated document
  );

  return updatedGroup;
};

export const groupServices = {
  createGroupIntoDB,
  allGroupSpecificUser,
  getNearestAllGroup,
  myAllJoinedGroup,
  leaveFromGroup,
  getSingleGroup,
  updateGroupProfile,
};
