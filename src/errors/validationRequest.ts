import { ZodObject, ZodRawShape, AnyZodObject, ZodType } from 'zod';
import catchAsync from '../utils/catchAsync';

const validationRequest = (schema: ZodType<any>) => {
  return catchAsync(async (req, res, next) => {
    await schema.parseAsync({
      body: req.body,
      
    });

    next();
  });
};

export default validationRequest;
