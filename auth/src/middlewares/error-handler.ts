import { Request, Response, NextFunction } from "express";
//import { RequestValidationError } from "../errors/request-validation-error";
//import { DatabaseConnectionError } from "../errors/database-connection-error";
import { CustomError } from '../errors/custom-error';
interface FormattedError {
  message: string;
  field?: string;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    //const formattedErrors: FormattedError[] = err.errors.map((error) => {
    //return { message: error?.msg, field: error?.type } as FormattedError;
    //});
    //return res.status(400).send({ errors: formattedErrors });
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  //if (err instanceof DatabaseConnectionError) {
  //return res.status(err.statusCode).send({ errors: [{ message: err.serializeErrors() }] });
  //return res.status(500).send({ errors: [{ message: err.reason }] });
  //}

  res.status(400).send({
    errors: [{ message: "Something went wrong" }],
  });
};
