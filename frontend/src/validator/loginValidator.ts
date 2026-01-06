interface LoginErrors {
  email?: string;
  password?: string;
}

export const validateLogin = (email: string, password: string): LoginErrors => {
  const errors: LoginErrors = {};

  // Check email
  if (!email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Invalid email address";
  }

  // Check password
  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 4) {
    errors.password = "Password must be at least 4 characters";
  }

  return errors;
};
