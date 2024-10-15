
import jwt from 'jsonwebtoken'
import { AppError } from './AppError.js';

 export const  getUserFieldsFromToken = (req, fields = []) => {
   const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new AppError("Authorization token not found", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!fields.length) {
      return decoded; 
    }

   
    const extractedFields = {};
    fields.forEach((field) => {
      if (decoded[field] !== undefined) {
        extractedFields[field] = decoded[field];
      }
    });

    return extractedFields;
  } catch (error) {
    throw new AppError("Invalid or expired token", 401);
  }
};

