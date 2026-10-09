import { isClerkAPIResponseError } from "@clerk/expo";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email: string) => {
  if (!email.trim()) return "Enter your email address.";
  if (!emailPattern.test(email.trim())) return "Enter a valid email address.";
  return "";
};

export const validatePassword = (password: string) => {
  if (!password) return "Enter your password.";
  if (password.length < 8) return "Use at least 8 characters.";
  return "";
};

export const getAuthErrorMessage = (error: unknown) => {
  if (isClerkAPIResponseError(error)) {
    return (
      error.errors[0]?.longMessage ??
      error.errors[0]?.message ??
      "Something went wrong. Please try again later."
    );
  }

  return "Something went wrong. Please try again later.";
};
