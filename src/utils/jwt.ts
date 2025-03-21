import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export interface JwtPayload { email: string; role?: string, id: string, phone?: string,userName:string,adminType:string}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1d" });
};

// export const verifyToken = (token: string): JwtPayload | null => {
//   try {
//     return jwt.verify(token, SECRET_KEY) as JwtPayload;
//   } catch (error) {
//     return null;
//   }
// };
