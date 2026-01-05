import { useState, useEffect } from "react";
import type { Employee } from "../types";

export const useEmployeeFilter = (employees: Employee[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtered, setFiltered] = useState<Employee[]>(employees);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFiltered(employees);
    } else {
      setFiltered(
        employees.filter((emp) =>
          emp.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, employees]);

  return { searchTerm, setSearchTerm, filtered };
};
