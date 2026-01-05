import type { Employee } from "../types";

export const EmployeeRow = ({
  employee,
  onToggle,
  onDelete,
}: {
  employee: Employee;
  onToggle: () => void;
  onDelete: () => void;
}) => (
  <tr>
    <td className="px-6 py-4">{employee.name}</td>
    <td className="px-6 py-4">{employee.email}</td>
    <td className="px-6 py-4">
      <span
        className={`px-2 py-1 rounded text-xs ${
          employee.isActive
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {employee.isActive ? "Active" : "Inactive"}
      </span>
    </td>
    <td className="px-6 py-4 space-x-3">
      <button
        onClick={onToggle}
        className={employee.isActive ? "text-red-600" : "text-green-600"}
      >
        {employee.isActive ? "Deactivate" : "Activate"}
      </button>
      <button onClick={onDelete} className="text-red-600">
        Delete
      </button>
    </td>
  </tr>
);
