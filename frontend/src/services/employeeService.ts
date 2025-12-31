import api from "../config/axios";
import type { Employee } from "../types";

export const employeeService = {
  async getEmployees(): Promise<Employee[]> {
    const response = await api.get("/employees");
    return response.data.data;
  },

  async addEmployee(data: { name: string; email: string; password: string }) {
    const response = await api.post("/employees", data);
    return response.data;
  },

  async updateEmployee(id: number, data: { isActive: boolean }) {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  },

  async deleteEmployee(id: number) {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },

  async searchEmployees(name: string): Promise<Employee[]> {
    const response = await api.get("/employees/search", { params: { name } });
    return response.data.data;
  },
};
