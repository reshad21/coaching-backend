class AppError extends Error {
    public statusCode: number;
  
    constructor(statusCoe: number, message: string, stack = '') {
      super(message);
      this.statusCode = statusCoe;
      if (stack) {
        this.stack = stack;
      } else {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }
  
  export default AppError;
  