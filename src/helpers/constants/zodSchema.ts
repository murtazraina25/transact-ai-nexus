import { z } from 'zod';
import { PASSWORD_LENGTH, NAME_LENGTH } from './constants';
import { PASSWORD_VALIDATION_MESSAGES, ERROR_VALIDATION_MESSAGES } from './messages';
import { PASSWORD_REGEX_PATTERNS, REGEX_PATTERNS } from './regexPatterns';

// Helper function with capitalization
function getFieldRequiredSchema(fieldName: string) {
  return z
    .string()
    .trim()
    .min(1, `${fieldName.charAt(0).toUpperCase()}${fieldName.slice(1)} is required`);
}

const emailSchema = z
  .string()
  .trim()
  .min(1, {
    message: ERROR_VALIDATION_MESSAGES.EMAIL_REQUIRED,
  })
  .refine((value) => REGEX_PATTERNS.EMAIL.test(value), {
    message: ERROR_VALIDATION_MESSAGES.EMAIL_INVALID,
  });

const passwordComplexSchema = z
  .string()
  .trim()
  .min(PASSWORD_LENGTH.MINIMUM, {
    message: PASSWORD_VALIDATION_MESSAGES.NEW_PASSWORD_MIN_LENGTH,
  })
  .max(PASSWORD_LENGTH.MAXIMUM, {
    message: PASSWORD_VALIDATION_MESSAGES.NEW_PASSWORD_MAX_LENGTH,
  })
  .refine((value) => PASSWORD_REGEX_PATTERNS.upper_case.test(value), {
    message: PASSWORD_VALIDATION_MESSAGES.UPPER_CASE,
  })
  .refine((value) => PASSWORD_REGEX_PATTERNS.lower_case.test(value), {
    message: PASSWORD_VALIDATION_MESSAGES.LOWER_CASE,
  })
  .refine((value) => PASSWORD_REGEX_PATTERNS.number.test(value), {
    message: PASSWORD_VALIDATION_MESSAGES.NUMBER,
  })
  .refine((value) => PASSWORD_REGEX_PATTERNS.special_character.test(value), {
    message: PASSWORD_VALIDATION_MESSAGES.SPECIAL_CHARACTER,
  })
  .refine((value) => !/\s/.test(value), {
    message: PASSWORD_VALIDATION_MESSAGES.NO_SPACES,
  });

const fullNameSchema = getFieldRequiredSchema('Full name')
  .min(NAME_LENGTH.MINIMUM, {
    message: `Full name should be at least ${NAME_LENGTH.MINIMUM} characters`,
  })
  .max(NAME_LENGTH.MAXIMUM, {
    message: `Full name should be less than ${NAME_LENGTH.MAXIMUM} characters`,
  })
  .regex(REGEX_PATTERNS.NAME, { message: 'Full name must contain only alphabetic characters, spaces or hyphens' });

// --- Combined Form Schemas for react-hook-form ---

export const loginFormSchema = z.object({
  email: emailSchema,
  password: getFieldRequiredSchema('Password'), // Simplified for login
});

export type LoginFormInputs = z.infer<typeof loginFormSchema>;

export const signUpFormSchema = z.object({
  email: emailSchema,
  password: passwordComplexSchema,
  fullName: fullNameSchema,
});

export type SignUpFormInputs = z.infer<typeof signUpFormSchema>;

export const forgotPasswordRequestFormSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordRequestFormInputs = z.infer<typeof forgotPasswordRequestFormSchema>;

export const resetPasswordFormSchema = z.object({
  newPassword: passwordComplexSchema,
  confirmNewPassword: getFieldRequiredSchema('Confirm password'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "New passwords do not match.",
  path: ["confirmNewPassword"], // Path to the field that caused the error
});

export type ResetPasswordFormInputs = z.infer<typeof resetPasswordFormSchema>;