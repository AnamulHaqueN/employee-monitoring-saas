import type { Employee } from "../types";

export const EmployeeSelect = ({
  employees,
  value,
  onSelect,
  searchTerm,
  onSearch,
}: {
  employees: Employee[];
  value: number | null;
  onSelect: (id: number) => void;
  searchTerm: string;
  onSearch: (term: string) => void;
}) => (
  <div>
    <label className="block text-sm font-medium mb-1">Search Employee</label>
    <input
      type="text"
      placeholder="Search..."
      value={searchTerm}
      onChange={(e) => onSearch(e.target.value)}
      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 mb-2"
    />
    <select
      value={value || ""}
      onChange={(e) => onSelect(Number(e.target.value))}
      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select Employee</option>
      {employees.map((e) => (
        <option key={e.id} value={e.id}>
          {e.name}
        </option>
      ))}
    </select>
  </div>
);
