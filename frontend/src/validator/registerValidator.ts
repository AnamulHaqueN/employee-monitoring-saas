type RegisterForm = {
  ownerName: string;
  ownerEmail: string;
  password: string;
  companyName: string;
  planId: number;
};

export function validateRegisterForm(data: RegisterForm) {
  const errors: Partial<Record<keyof RegisterForm, string>> = {};

  if (!data.ownerName.trim() || data.ownerName.length < 3) {
    errors.ownerName = "Owner name must be at least 3 characters";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.ownerEmail)) {
    errors.ownerEmail = "Invalid email address";
  }

  if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(data.password)) {
    errors.password =
      "Password must be at least 8 characters and include a number";
  }

  if (!data.companyName.trim()) {
    errors.companyName = "Company name is required";
  }

  if (!data.planId) {
    errors.planId = "Please select a plan";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}
