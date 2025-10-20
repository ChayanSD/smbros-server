import { NextFunction, Request, Response } from "express";
import { customerCardAttach } from "../../services/stripe/attachCard.service";
import { ResponseHandler } from "../../utils/responseHandler";

export const setupIntentController = async (req: Request, res: Response , next : NextFunction) => {
  try {
    const clientSecret = await customerCardAttach.setupIntent(req.body);
    ResponseHandler.success(res, { clientSecret }, "Setup Intent created");
  } catch (err) {
    next(err)
  }
};

export const attachCardController = async (req: Request, res: Response , next : NextFunction) => {
  try {
    const result = await customerCardAttach.attachCard(req.body);
    ResponseHandler.success(res, result, "Card attached successfully");
  } catch (error) {
    next(error);
  }
};