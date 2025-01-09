/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { groupValidations } from './group.validation';
import { groupController } from './group.controller';
const router = express.Router();

router.post(
  '/create-group',
  fileUploadHandler(),
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse the body if it contains data in stringified JSON format
      let validatedData;
      if (req.body.data) {
        validatedData = groupValidations.createGroupValidationSchema.parse(
          JSON.parse(req.body.data),
        );
      }

      // Handle image updates if files are uploaded
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        // Assuming `fileUploadHandler` stores files in req.files
        const uploadedFiles = req.files.map((file: any) => file.path);
        validatedData = {
          ...validatedData,
          image: uploadedFiles[0], // Update the specific image field
        };
      }

      // Pass the validated data to the controller
      req.body = validatedData;

      await groupController.createGroup(req, res, next);
    } catch (error) {
      next(error);
    }
  },
);

// get single group by id
router.get('/single-group/:groupId', groupController.getSingleGroup);

// update group profile
router.post(
  '/update-group/:groupId',
  fileUploadHandler(),
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse the body if it contains data in stringified JSON format
      let validatedData;
      if (req.body.data) {
        validatedData = groupValidations.updateGroupValidationSchema.parse(
          JSON.parse(req.body.data),
        );
      }

      // Handle image updates if files are uploaded
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        // Assuming `fileUploadHandler` stores files in req.files
        const uploadedFiles = req.files.map((file: any) => file.path);
        validatedData = {
          ...validatedData,
          image: uploadedFiles[0], // Update the specific image field
        };
      }

      // Pass the validated data to the controller
      req.body = validatedData;

      await groupController.groupUpdate(req, res, next);
    } catch (error) {
      next(error);
    }
  },
);

//get specific user group
router.get(
  '/specific-group',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  groupController.getSpecificGroup,
);

// user joined groups
router.get(
  '/user-group',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  groupController.myAllJoinedGroup,
);

//get nearest group by coresponding user

router.get(
  '/near-group',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  groupController.getNearestGroup,
);

// leave from group
router.post(
  '/user-leave',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  groupController.leaveFromGroup,
);

export const groupRoutes = router;
