import express from "express";

declare global {
  namespace Express {
    interface Request {
      objKey?: Record<string, any>;
      keyToken?: Record<string, any>;
      shop?: Record<string, any>;
      refreshToken?: string;
    }
  }
}
