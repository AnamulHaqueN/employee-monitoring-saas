import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { planService } from "../services/planService";
import type { Plan } from "../types";
import { validateRegisterForm } from "../validator/registerValidator";

export const Register = () => {
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [planId, setPlanId] = useState<number>(0);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    ownerName?: string;
    ownerEmail?: string;
    password?: string;
    companyName?: string;
    planId?: string;
  }>({});

  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const data = await planService.getPlans();
      setPlans(data);
      if (data.length > 0) {
        setPlanId(data[0].id);
      }
    } catch (err) {
      console.error("Failed to load plans:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Call reusable validator
    const { errors, isValid } = validateRegisterForm({
      ownerName,
      ownerEmail,
      password,
      companyName,
      planId,
    });

    if (!isValid) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    setLoading(true);

    try {
      await register({ ownerName, ownerEmail, password, companyName, planId });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Please enter valid details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Company Account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label
                htmlFor="ownerName"
                className="block text-sm font-medium text-gray-700"
              >
                Owner Name
              </label>
              <input
                id="ownerName"
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              />
              {fieldErrors.ownerName && (
                <p className="text-red-600 text-sm mt-1">
                  {fieldErrors.ownerName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="ownerEmail"
                className="block text-sm font-medium text-gray-700"
              >
                Owner Email
              </label>
              <input
                id="ownerEmail"
                type="email"
                required
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              />
              {fieldErrors.ownerEmail && (
                <p className="text-red-600 text-sm mt-1">
                  {fieldErrors.ownerEmail}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              />
              {fieldErrors.password && (
                <p className="text-red-600 text-sm mt-1">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700"
              >
                Company Name
              </label>
              <input
                id="companyName"
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              />
              {fieldErrors.companyName && (
                <p className="text-red-600 text-sm mt-1">
                  {fieldErrors.companyName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="plan"
                className="block text-sm font-medium text-gray-700"
              >
                Select Plan
              </label>
              <select
                id="plan"
                value={planId}
                onChange={(e) => setPlanId(Number(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name.toUpperCase()} - ${plan.pricePerEmployee}
                    /employee
                  </option>
                ))}
              </select>
              {fieldErrors.planId && (
                <p className="text-red-600 text-sm mt-1">
                  {fieldErrors.planId}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </div>

          <div className="text-center">
            <Link to="/login" className="text-blue-600 hover:text-blue-500">
              Already have an account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
