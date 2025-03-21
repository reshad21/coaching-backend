import { TErrorSources, TGenericErrorResponse } from '@/types/error';
import { ZodError, ZodIssue } from 'zod';

const handleZodError = (error: ZodError): TGenericErrorResponse => {
  const statusCode = 400;
  const errorSources: TErrorSources = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    };
  });

  return {
    statusCode,
    message: 'Validation error',
    errorSources,
  };
};

export default handleZodError;
