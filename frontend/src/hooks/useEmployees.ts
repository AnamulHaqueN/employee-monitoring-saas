import { useEffect, useState } from "react";
import { employeeService } from "../services/employeeService";
import type { Employee } from "../types";

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setEmployees(await employeeService.getEmployees());
    } catch (err) {
      console.error("Failed to load employees", err);
    } finally {
      setLoading(false);
    }
  };

  const searchEmployees = async (term: string) => {
    if (!term.trim()) return loadEmployees();
    setEmployees(await employeeService.searchEmployees(term));
  };

  const toggleActive = async (id: number, isActive: boolean) => {
    await employeeService.updateEmployee(id, { isActive: !isActive });
    loadEmployees();
  };

  const deleteEmployee = async (id: number) => {
    await employeeService.deleteEmployee(id);
    loadEmployees();
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  return {
    employees,
    loading,
    loadEmployees,
    searchEmployees,
    toggleActive,
    deleteEmployee,
  };
};
