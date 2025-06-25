export const REGEX_PATTERNS = {
  NAME: /^[a-zA-Z\s-]+$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

export const PASSWORD_REGEX_PATTERNS = {
  number: /^(?=.*\d)/,
  upper_case: /^(?=.*[A-Z])/,
  lower_case: /^(?=.*[a-z])/,
  special_character: /^(?=.*[!@#$%^&*])/,
};
