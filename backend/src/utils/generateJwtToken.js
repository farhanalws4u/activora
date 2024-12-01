import jwt from "jsonwebtoken";

export const generateJwtToken = (user) => {
  const expiresIn = Math.floor((Date.now() + 10 * 24 * 60 * 60 * 1000) / 1000);
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn,
  });
};
