# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

```ts
// src/types/index.ts
export interface User {
  id: number;
  name: string;
  email: string;
  role: "owner" | "employee";
  companyId: number;
  isActive: boolean;
  company?: Company;
}

export interface Company {
  id: number;
  name: string;
  planId: number;
  plan?: Plan;
}

export interface Plan {
  id: number;
  name: "basic" | "pro" | "enterprise";
  pricePerEmployee: number;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  role: "employee";
  companyId: number;
  isActive: boolean;
  createdAt: string;
}

export interface Screenshot {
  id: number;
  filePath: string;
  captureTime: string;
  date: string;
  hour: number;
  minute?: number;
  minuteBucket: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface GroupedScreenshots {
  [hour: number]: {
    [minuteBucket: number]: Screenshot[];
  };
}

export interface AuthResponse {
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiResponse<T> {
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  meta: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
    firstPage: number;
  };
  data: T[];
}

// src/lib/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3333",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

// src/services/authService.ts
import api from "@/lib/axios";
import { AuthResponse, User, ApiResponse } from "@/types";

export const authService = {
  async register(data: {
    ownerName: string;
    ownerEmail: string;
    password: string;
    companyName: string;
    planId: number;
  }): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  async getMe(): Promise<ApiResponse<User>> {
    const response = await api.get<ApiResponse<User>>("/auth/me");
    return response.data;
  },

  setToken(token: string): void {
    localStorage.setItem("token", token);
  },

  getToken(): string | null {
    return localStorage.getItem("token");
  },

  setUser(user: User): void {
    localStorage.setItem("user", JSON.stringify(user));
  },

  getUser(): User | null {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

// src/services/planService.ts
import api from "@/lib/axios";
import { Plan, ApiResponse } from "@/types";

export const planService = {
  async getPlans(): Promise<Plan[]> {
    const response = await api.get<ApiResponse<Plan[]>>("/plans");
    return response.data.data;
  },
};

// src/services/employeeService.ts
import api from "@/lib/axios";
import { Employee, ApiResponse } from "@/types";

export const employeeService = {
  async getEmployees(): Promise<Employee[]> {
    const response = await api.get<ApiResponse<Employee[]>>("/employees");
    return response.data.data;
  },

  async addEmployee(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<ApiResponse<Employee>> {
    const response = await api.post<ApiResponse<Employee>>("/employees", data);
    return response.data;
  },

  async updateEmployee(
    id: number,
    data: { isActive: boolean }
  ): Promise<ApiResponse<Employee>> {
    const response = await api.put<ApiResponse<Employee>>(
      `/employees/${id}`,
      data
    );
    return response.data;
  },

  async deleteEmployee(id: number): Promise<void> {
    await api.delete(`/employees/${id}`);
  },

  async searchEmployees(name: string): Promise<Employee[]> {
    const response = await api.get<ApiResponse<Employee[]>>(
      `/employees/search?name=${name}`
    );
    return response.data.data;
  },
};

// src/services/screenshotService.ts
import api from '@/lib/axios'
import { Screenshot, ApiResponse, PaginatedResponse, GroupedScreenshots } from '@/types'

export const screenshotService = {
  async uploadScreenshot(file: File, captureTime: Date): Promise<ApiResponse<Screenshot>> {
    const formData = new FormData()
    formData.append('screenshot', file)
    formData.append('captureTime', captureTime.toISOString())

    const response = await api.post<ApiResponse<Screenshot>>('/screenshots', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async getScreenshots(params: {
    employeeId?: number
    date?: string
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<Screenshot>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Screenshot>>>('/screenshots', {
      params,
    })
    return response.data.data
  },

  async getGroupedScreenshots(employeeId: number, date: string): Promise<{
    employee: { id: number; name: string; email: string }
    date: string
    statistics: {
      totalScreenshots: number
      hoursActive: number
      firstScreenshot: string | null
      lastScreenshot: string | null
    }
    screenshots: GroupedScreenshots
  }> {
    const response = await api.get('/screenshots/grouped', {
      params: { employeeId, date },
    })
    return response.data.data
  },

  async deleteScreenshot(id: number): Promise<void> {
    await api.delete(`/screenshots/${id}`)
  },

  async getStatistics(employeeId: number, startDate: string, endDate: string) {
    const response = await api.get('/screenshots/statistics', {
      params: { employeeId, startDate, endDate },
    })
    return response.data.data
  },
}

// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react'
import { User } from '@/types'
import { authService } from '@/services/authService'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken()
      if (token) {
        try {
          const response = await authService.getMe()
          setUser(response.data)
        } catch (error) {
          authService.setToken('')
          setUser(null)
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password)
    authService.setToken(response.data.token)
    authService.setUser(response.data.user)
    setUser(response.data.user)
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: ('owner' | 'employee')[]
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

// src/components/Layout.tsx
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-900">
                ScreenTracker
              </Link>
              {user && (
                <div className="ml-10 flex space-x-4">
                  {user.role === 'owner' && (
                    <>
                      <Link
                        to="/dashboard"
                        className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/employees"
                        className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Employees
                      </Link>
                    </>
                  )}
                  {user.role === 'employee' && (
                    <Link
                      to="/upload"
                      className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Upload Screenshot
                    </Link>
                  )}
                </div>
              )}
            </div>
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  {user.name} ({user.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}

// src/pages/Register.tsx
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '@/services/authService'
import { planService } from '@/services/planService'
import { useAuth } from '@/context/AuthContext'
import { Plan } from '@/types'

export const Register = () => {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    ownerName: '',
    ownerEmail: '',
    password: '',
    companyName: '',
    planId: '',
  })

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await planService.getPlans()
        setPlans(data)
      } catch (err) {
        setError('Failed to load plans')
      }
    }
    fetchPlans()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authService.register({
        ...formData,
        planId: parseInt(formData.planId),
      })

      authService.setToken(response.data.token)
      authService.setUser(response.data.user)
      setUser(response.data.user)

      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Company Account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">
                Owner Name
              </label>
              <input
                id="ownerName"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="ownerEmail" className="block text-sm font-medium text-gray-700">
                Owner Email
              </label>
              <input
                id="ownerEmail"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.ownerEmail}
                onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                id="companyName"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="planId" className="block text-sm font-medium text-gray-700">
                Select Plan
              </label>
              <select
                id="planId"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.planId}
                onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
              >
                <option value="">Choose a plan</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name.toUpperCase()} - ${plan.pricePerEmployee}/employee
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="text-center">
            <Link to="/login" className="text-sm text-blue-600 hover:text-blue-500">
              Already have an account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

// src/pages/Login.tsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(formData.email, formData.password)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="text-center">
            <Link to="/register" className="text-sm text-blue-600 hover:text-blue-500">
              Don't have an account? Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

// src/pages/Employees.tsx
import { useState, useEffect } from 'react'
import { Layout } from '@/components/Layout'
import { employeeService } from '@/services/employeeService'
import { Employee } from '@/types'

export const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      const data = await employeeService.getEmployees()
      setEmployees(data)
    } catch (error) {
      console.error('Failed to fetch employees:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchEmployees()
      return
    }

    try {
      const data = await employeeService.searchEmployees(searchTerm)
      setEmployees(data)
    } catch (error) {
      console.error('Search failed:', error)
    }
  }

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await employeeService.addEmployee(formData)
      setFormData({ name: '', email: '', password: '' })
      setShowAddForm(false)
      fetchEmployees()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add employee')
    }
  }

  const handleToggleActive = async (id: number, isActive: boolean) => {
    try {
      await employeeService.updateEmployee(id, { isActive: !isActive })
      fetchEmployees()
    } catch (error) {
      console.error('Failed to update employee:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this employee?')) return

    try {
      await employeeService.deleteEmployee(id)
      fetchEmployees()
    } catch (error) {
      console.error('Failed to delete employee:', error)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">Loading...</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {showAddForm ? 'Cancel' : 'Add Employee'}
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Add New Employee</h2>
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add Employee
              </button>
            </form>
          </div>
        )}

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Search by name..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-700"
            >
              Search
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{employee.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{employee.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          employee.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {employee.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => handleToggleActive(employee.id, employee.isActive)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        {employee.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
```
