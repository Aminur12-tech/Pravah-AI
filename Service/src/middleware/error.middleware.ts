
import type {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";

export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler: ErrorRequestHandler = (
  err,
  _req,
  res: Response,
  _next
) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
