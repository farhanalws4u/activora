import jwt from "jsonwebtoken";

export const generateJwtToken = (user) => {
  const expiresIn =  604800 // 7 days in seconds
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn,
  });
};
