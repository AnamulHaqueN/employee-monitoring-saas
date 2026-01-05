import { useState } from "react";
import { useEmployees } from "../hooks/useEmployees";
import { EmployeeRow } from "./EmployeeRow";
import { AddEmployeeModal } from "./AddEmployeeModal";

export const Employees = () => {
  const {
    employees,
    loading,
    searchEmployees,
    toggleActive,
    deleteEmployee,
    loadEmployees,
  } = useEmployees();

  const [showModal, setShowModal] = useState(false);

  if (loading) {
    return <div className="flex justify-center py-20">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Employees</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Employee
        </button>
      </div>

      <input
        className="w-full mb-4 p-2 border rounded"
        placeholder="Search..."
        onChange={(e) => searchEmployees(e.target.value)}
      />

      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left">Name</th>
            <th className="px-6 py-3 text-left">Email</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <EmployeeRow
              key={emp.id}
              employee={emp}
              onToggle={() => toggleActive(emp.id, emp.isActive)}
              onDelete={() =>
                window.confirm("Delete employee?") && deleteEmployee(emp.id)
              }
            />
          ))}
        </tbody>
      </table>

      {showModal && (
        <AddEmployeeModal
          onClose={() => setShowModal(false)}
          onSuccess={loadEmployees}
        />
      )}
    </div>
  );
};
