import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { groupServices } from "./group.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

//create group
const createGroup = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      let coverPhoto;
      if (req.files && 'image' in req.files && req.files.image[0]) {
        coverPhoto = `/images/${req.files.image[0].filename}`;
      }
  
      const value = {
        coverPhoto,
        ...req.body,
      };
  
      const result = await groupServices.createGroupIntoDB(value)
  
      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Group created successfully',
        data: result,
      });
    }
  );

const getSpecificGroup = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      
  
      const result = await groupServices.allGroupSpecificUser(req.user.id)
  
      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'specific user group retriev successfully',
        data: result,
      });
    }
  );


  export const groupController={
    createGroup,
    getSpecificGroup
  }