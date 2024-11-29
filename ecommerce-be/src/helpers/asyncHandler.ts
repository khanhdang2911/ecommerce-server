import { NextFunction, Request, Response } from "express";
const asyncHandler = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    return fn(req, res, next).catch(next);
  };
};

export default asyncHandler;
