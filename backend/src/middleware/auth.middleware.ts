import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization Token missing",
      });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "erp secrete",
    ) as {
      id: number;
      mail: string;
    };

    req.user = {
      id: decoded.id,
      email: decoded.mail,
    };
    (req as any).user = decoded;

    next();
  } catch (error: any) {

    return res.status(401).json({
      message: "Invalid token",
    });
  }
};
