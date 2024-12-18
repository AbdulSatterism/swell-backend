import { TGroup } from "./group.interface";
import { User } from "../user/user.model";
import ApiError from "../../../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import { Group } from "./group.model";
import mongoose from "mongoose";

const createGroupIntoDB = async (payload: Partial<TGroup>) => {
    const { createdBy } = payload;
   

    const isExistUser = await User.isExistUserById(createdBy as unknown as string)

    if (!isExistUser) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Main user not found");
    }

     // Start a session for the transaction
    const session = await mongoose.startSession();
  
    try {
      // Start a transaction
      session.startTransaction();
  
      // Check if the user has reached their group limit
      if (isExistUser.groupLimit >= 3) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "This user group limit is over, already created 3 groups");
      }
  
      // Create the group in the database
      const result = await Group.create([payload], { session });
  
      // Increment the user's group limit (atomic update within the transaction)
      await User.findByIdAndUpdate(
        { _id: createdBy },
        { $inc: { groupLimit: 1 } },
        { new: true, session }
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

const allGroupSpecificUser = async (userId:string) => {
   
    const isExistUser = await User.isExistUserById(userId)

    if (!isExistUser) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "this user not found");
    }

const specificUserGroup= await Group.find({createdBy:userId})


if(!specificUserGroup.length ){
  throw new ApiError(StatusCodes.NOT_FOUND, "This user has no group avail able");
}



return specificUserGroup;
  };


export const groupServices={
    createGroupIntoDB,
    allGroupSpecificUser
}