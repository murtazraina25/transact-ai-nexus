export const REGEX_PATTERNS = {
  NAME: /^[a-zA-Z]+$/,
  BOT_NAME: /^[A-Za-z\s]+$/,
  PROJECT_NAME: /^[A-Za-z\s]+$/,
  WHATSAPP_NUMBER: /^\+?[1-9][0-9]{9,11}$/,
  EMAIL: /^[a-z0-9.]+@[a-z]+\.[a-z]{2,5}$/,
  URL: /^((?:https?):\/\/)([^:/\s.#?]+\.[^:/\s#?]+)(:\d+)?((?:\/\w+)*\/)?([\w\-.]+[^#?\s]+)?([^#]+)?(#[\w-]*)?$/,
};

export const PASSWORD_REGEX_PATTERNS = {
  number: /^(?=.*\d)/,
  upper_case: /^(?=.*[A-Z])/,
  lower_case: /^(?=.*[a-z])/,
  special_character: /^(?=.*[!@#$%^&*])/,
};
