import moment from "moment";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateInput: string | Date): string => {
  const date = moment(dateInput);
  return `${date.format("DD-MM-YY")}, ${date.format("hh:mm A")}`;
};

export const checkPasswordStrength = (password: string) => {
  let strength = "Weak";
  let messages: string[] = [];

  if (password.length >= 8) {
    strength = "Medium";
    messages.push("Password length is good.");
  } else {
    messages.push("Password must be at least 8 characters long.");
  }

  if (/[A-Z]/.test(password)) {
    strength = "Strong";
    messages.push("Password contains uppercase letters.");
  } else {
    messages.push("Password should include at least one uppercase letter.");
  }

  if (/[0-9]/.test(password)) {
    strength = "Strong";
    messages.push("Password contains numbers.");
  } else {
    messages.push("Password should include at least one number.");
  }

  if (/[@$!%*?&#]/.test(password)) {
    strength = "Strong";
    messages.push("Password contains special characters.");
  } else {
    messages.push("Password should include at least one special character.");
  }

  return { strength, messages };
};
