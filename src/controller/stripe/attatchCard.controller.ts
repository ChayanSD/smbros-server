import { NextFunction, Request, Response } from "express";
import { customerCardAttach } from "../../services/stripe/attatcCard.service"; 
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
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};