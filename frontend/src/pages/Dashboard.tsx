import { useState, useEffect } from "react";
import { employeeService } from "../services/employeeService";
import { screenshotService } from "../services/screenshotService";
import { format } from "date-fns";
import type { Employee, ScreenshotGroupedResponse } from "../types";

export const Dashboard = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [screenshotData, setScreenshotData] =
    useState<ScreenshotGroupedResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (selectedEmployee && selectedDate) {
      loadScreenshots();
    }
  }, [selectedEmployee, selectedDate]);

  const loadEmployees = async () => {
    try {
      const data = await employeeService.getEmployees();
      const activeEmployees = data.filter((emp) => emp.isActive);

      setEmployees(activeEmployees);

      if (activeEmployees.length > 0) {
        setSelectedEmployee(activeEmployees[0].id);
      }
    } catch (err) {
      console.error("Failed to load employees:", err);
    }
  };

  const loadScreenshots = async () => {
    if (!selectedEmployee || !selectedDate) return;

    try {
      setLoading(true);
      const data = await screenshotService.getGroupedScreenshots(
        selectedEmployee,
        selectedDate
      );
      setScreenshotData(data);
    } catch (err) {
      console.error("Failed to load screenshots:", err);
      setScreenshotData(null);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (hour: number, minuteBucket: number) => {
    const endMinute = minuteBucket + 5;
    return `${hour.toString().padStart(2, "0")}:${minuteBucket
      .toString()
      .padStart(2, "0")} - ${hour.toString().padStart(2, "0")}:${endMinute
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Activity Dashboard
      </h1>

      {/* Filters */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Employee
            </label>
            <select
              value={selectedEmployee ?? ""}
              onChange={(e) => setSelectedEmployee(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose an employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      )}

      {/* Data */}
      {!loading && screenshotData && (
        <>
          {/* Summary */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {screenshotData.employee.name} — {screenshotData.date}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Stat
                label="Total Screenshots"
                value={screenshotData.statistics.totalScreenshots}
                color="blue"
              />
              <Stat
                label="Hours Active"
                value={screenshotData.statistics.hoursActive}
                color="green"
              />
              <Stat
                label="First Screenshot"
                value={
                  screenshotData.statistics.firstScreenshot
                    ? format(
                        new Date(screenshotData.statistics.firstScreenshot),
                        "HH:mm"
                      )
                    : "N/A"
                }
                color="purple"
              />
              <Stat
                label="Last Screenshot"
                value={
                  screenshotData.statistics.lastScreenshot
                    ? format(
                        new Date(screenshotData.statistics.lastScreenshot),
                        "HH:mm"
                      )
                    : "N/A"
                }
                color="orange"
              />
            </div>
          </div>

          {/* Screenshots */}
          {Object.entries(screenshotData.screenshots)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([hour, buckets]) => (
              <div
                key={hour}
                className="bg-white shadow-md rounded-lg p-6 mb-6"
              >
                <h3 className="text-lg font-semibold mb-4">
                  Hour: {hour.padStart(2, "0")}:00
                </h3>

                {Object.entries(buckets)
                  .sort(([a], [b]) => Number(a) - Number(b))
                  .map(([minuteBucket, screenshots]) => (
                    <div
                      key={minuteBucket}
                      className="border-l-4 border-blue-500 pl-4 mb-4"
                    >
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        {formatTime(Number(hour), Number(minuteBucket))} (
                        {screenshots.length})
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {screenshots.map((screenshot) => (
                          <div key={screenshot.id} className="relative">
                            <img
                              src={screenshot.filePath}
                              alt="Screenshot"
                              className="w-full h-32 object-cover rounded-lg cursor-pointer"
                              onClick={() =>
                                window.open(screenshot.filePath, "_blank")
                              }
                            />
                            <div className="absolute bottom-0 inset-x-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
                              {format(
                                new Date(screenshot.captureTime),
                                "HH:mm:ss"
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            ))}
        </>
      )}

      {!loading && !screenshotData && selectedEmployee && (
        <div className="bg-white shadow-md rounded-lg p-12 text-center">
          <p className="text-gray-500 text-lg">
            No screenshots found for this date
          </p>
        </div>
      )}
    </div>
  );
};

/* Small stat component */
const Stat = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color: string;
}) => (
  <div className={`bg-${color}-50 p-4 rounded-lg`}>
    <p className="text-sm text-gray-600">{label}</p>
    <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
  </div>
);
