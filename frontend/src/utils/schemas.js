import * as yup from "yup";

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[A-Za-z\s]+$/;

export const registerSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .matches(nameRegex, "Invalid name"),
  email: yup
    .string()
    .required("Email is required")
    .matches(emailRegex, "Invalid email address"),

  password: yup
    .string()
    .required("Password is required")
    .matches(
      passwordRegex,
      "Password must contain at least 8 characters, one letter, and one number"
    ),

  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});
