export const REGEX_PATTERNS = {
  NAME: /^[a-zA-Z\s-]+$/,
  EMAIL: /^[a-z0-9.]+@[a-z]+\.[a-z]{2,5}$/,
};

export const PASSWORD_REGEX_PATTERNS = {
  number: /^(?=.*\d)/,
  upper_case: /^(?=.*[A-Z])/,
  lower_case: /^(?=.*[a-z])/,
  special_character: /^(?=.*[!@#$%^&*])/,
};
