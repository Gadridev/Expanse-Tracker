import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

// Middleware to validate request body against provided Zod schema
export const validate = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse the request body using the provided schema
      schema.parse(req.body);
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      // If validation fails, check if it's a ZodError and return a structured response
      if (error instanceof ZodError) {
        // Zod validation error
        const errorMessages = error.errors.map((err) => ({
          message: err.message,
          path: err.path.join('.'), // Join the path array for better clarity
        }));
        res.status(400).json({ error: errorMessages });
      } else {
        // Other types of errors
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  };
};
