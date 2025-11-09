import { 
  isValidEmail, 
  isValidPhone, 
  hasMinLength, 
  hasMaxLength,
  isRequired, 
  isValidPassword,
  containsOnlyLetters,
  isValidUsername
} from '../utils/Validation';

export const validateRegisterForm = (data) => {
  const errors = {};

  if (!isRequired(data.username)) {
    errors.username = "Username is required.";
  } else if (!hasMinLength(data.username, 3)) {
    errors.username = "Username must be at least 3 characters.";
  } else if (!hasMaxLength(data.username, 150)) {
    errors.username = "Username must not exceed 150 characters.";
  } else if (!isValidUsername(data.username)) {
    errors.username = "Username can only contain letters, numbers, underscores and dashes.";
  }

  
  if (!isRequired(data.password)) {
    errors.password = "Password is required.";
  } else if (!isValidPassword(data.password)) {
    errors.password = "Password must be at least 6 characters.";
  }

  if (!isRequired(data.first_name)) {
    errors.first_name = "First name is required.";
  } else if (!hasMaxLength(data.first_name, 50)) {
    errors.first_name = "First name must not exceed 50 characters.";
  } else if (!containsOnlyLetters(data.first_name)) {
    errors.first_name = "First name can only contain letters.";
  }

  if (!isRequired(data.last_name)) {
    errors.last_name = "Last name is required.";
  } else if (!hasMaxLength(data.last_name, 50)) {
    errors.last_name = "Last name must not exceed 50 characters.";
  } else if (!containsOnlyLetters(data.last_name)) {
    errors.last_name = "Last name can only contain letters.";
  }

  if (data.email && data.email.trim() !== "") {
    if (!isValidEmail(data.email)) {
      errors.email = "Invalid email address.";
    } else if (!hasMaxLength(data.email, 254)) {
      errors.email = "Email must not exceed 254 characters.";
    }
  }

  if (data.phone_number && data.phone_number.trim() !== "") {
    if (!isValidPhone(data.phone_number)) {
      errors.phone_number = "Phone number must be at least 10 digits.";
    } else if (!hasMaxLength(data.phone_number, 20)) {
      errors.phone_number = "Phone number must not exceed 20 characters.";
    }
  }


  if (!isRequired(data.address)) {
    errors.address = "Address is required.";
  } else if (!hasMinLength(data.address, 5)) {
    errors.address = "Address must be at least 5 characters.";
  } else if (!hasMaxLength(data.address, 255)) {
    errors.address = "Address must not exceed 255 characters.";
  }

  return errors;
};

export const validateLoginForm = (data) => {
  const errors = {};

  if (!isRequired(data.username)) {
    errors.username = "Username is required.";
  }

  if (!isRequired(data.password)) {
    errors.password = "Password is required.";
  }

  return errors;
};

export const validateChangePasswordForm = (data) => {
  const errors = {};

  if (!isRequired(data.old_password)) {
    errors.old_password = "Current password is required.";
  }

  if (!isRequired(data.new_password)) {
    errors.new_password = "New password is required.";
  } else if (!isValidPassword(data.new_password)) {
    errors.new_password = "New password must be at least 6 characters.";
  }

  if (!isRequired(data.confirm_password)) {
    errors.confirm_password = "Please confirm your new password.";
  } else if (data.new_password !== data.confirm_password) {
    errors.confirm_password = "Passwords do not match.";
  }

  return errors;
};

export const validateProfileForm = (data) => {
  const errors = {};

  if (!isRequired(data.first_name)) {
    errors.first_name = "First name is required.";
  } else if (!containsOnlyLetters(data.first_name)) {
    errors.first_name = "First name can only contain letters.";
  }

  if (!isRequired(data.last_name)) {
    errors.last_name = "Last name is required.";
  } else if (!containsOnlyLetters(data.last_name)) {
    errors.last_name = "Last name can only contain letters.";
  }

  if (data.email && data.email.trim() !== "" && !isValidEmail(data.email)) {
    errors.email = "Invalid email address.";
  }

  if (data.phone_number && data.phone_number.trim() !== "" && !isValidPhone(data.phone_number)) {
    errors.phone_number = "Invalid phone number format.";
  }

  if (!isRequired(data.address)) {
    errors.address = "Address is required.";
  } else if (!hasMinLength(data.address, 5)) {
    errors.address = "Address must be at least 5 characters.";
  }

  return errors;
};