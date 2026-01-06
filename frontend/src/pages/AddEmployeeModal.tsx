import { useState } from "react";
import { employeeService } from "../services/employeeService";

export const AddEmployeeModal = ({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await employeeService.addEmployee(form);
      onSuccess();
      onClose();
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <form
        onSubmit={submit}
        className="bg-white p-6 rounded-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold">Add Employee</h2>

        {["name", "email", "password"].map((field) => (
          <input
            key={field}
            type={field === "password" ? "password" : "text"}
            placeholder={field}
            required
            className="w-full border p-2 rounded"
            value={(form as any)[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          />
        ))}

        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 text-white py-2 rounded">
            Add
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-300 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
