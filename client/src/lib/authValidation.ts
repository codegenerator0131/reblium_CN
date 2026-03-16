// Auth input validation — ported from main branch src/lib/auth_validation.tsx

export function validateEmail(email: string): string | null {
  if (!email) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Invalid email format";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter";
  if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter";
  if (!/[0-9]/.test(password)) return "Password must contain a number";
  return null;
}

export const MOBILE_MAX_LENGTH = 11;

export function validateMobile(mobile: string): string | null {
  if (!mobile) return "Mobile number is required";
  if (!/^\d{7,15}$/.test(mobile)) return "Invalid mobile number";
  return null;
}

/** Strip non-digit characters and enforce max length */
export function sanitizeMobile(value: string): string {
  return value.replace(/\D/g, "").slice(0, MOBILE_MAX_LENGTH);
}

export const SMS_COUNTDOWN_SECONDS = 60;
