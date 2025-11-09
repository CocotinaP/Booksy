export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPhone = (phone) => {
  return /^\+?[\d\s\-()]{10,}$/.test(phone);
};

export const hasMinLength = (value, minLength) => {
  return value && value.trim().length >= minLength;
};

export const hasMaxLength = (value, maxLength) => {
  return !value || value.trim().length <= maxLength;
};

export const isRequired = (value) => {
  return value && value.trim().length > 0;
};

export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

export const isStrongPassword = (password) => {
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
};

export const containsOnlyLetters = (value) => {
  return /^[a-zA-Z\s]+$/.test(value);
};

export const containsOnlyNumbers = (value) => {
  return /^\d+$/.test(value);
};

export const isValidUsername = (username) => {
  return /^[a-zA-Z0-9_-]+$/.test(username);
};