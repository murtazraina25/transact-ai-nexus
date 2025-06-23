export const TOASTER_MESSAGES = {
  LOGIN_SUCCESS: 'Logged in successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',
  UNAUTHORIZED: 'Sorry, You are not authorized',
};

export const PASSWORD_VALIDATION_MESSAGES = {
  UPPER_CASE: 'Password should have at least one upper case letter',
  LOWER_CASE: 'Password should have at least one lower case letter',
  SPECIAL_CHARACTER: 'Password should have at least one special character',
  NUMBER: 'Password should have at lease one number',
  CURRENT_AND_NEW_PASSWORD: 'Current password and New password should not be the same',
  PASSWORD_MISMATCH: 'New password and password confirmation should match',
  NEW_PASSWORD_MAX_LENGTH: 'Password cannot exceed 25 characters',
  NEW_PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters long',
  NO_SPACES: 'Password cannot contain spaces',
};

export const ERROR_VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Enter a valid email address',
  FIELD_REQUIRED: (fieldName: string) => `${fieldName} is required`,
};