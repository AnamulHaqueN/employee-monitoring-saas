import { useEffect, useState } from "react";
import { format } from "date-fns";
import { employeeService } from "../services/employeeService";
import { screenshotService } from "../services/screenshotService";
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

  /* Load employees once */
  useEffect(() => {
    loadEmployees();
  }, []);

  /* Load screenshots when filters change */
  useEffect(() => {
    if (selectedEmployee && selectedDate) {
      loadScreenshots();
    }
  }, [selectedEmployee, selectedDate]);

  const loadEmployees = async () => {
    try {
      const data = await employeeService.getEmployees();
      const activeEmployees = data.filter((e) => e.isActive);

      setEmployees(activeEmployees);

      if (activeEmployees.length > 0) {
        setSelectedEmployee(activeEmployees[0].id);
      }
    } catch (error) {
      console.error("Failed to load employees", error);
    }
  };

  const loadScreenshots = async () => {
    try {
      setLoading(true);
      const data = await screenshotService.getGroupedScreenshots(
        selectedEmployee!,
        selectedDate
      );

      console.log("Grouped screenshot response:", data);
      setScreenshotData(data);
    } catch (error) {
      console.error("Failed to load screenshots", error);
      setScreenshotData(null);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeRange = (hour: number, bucket: number) => {
    const end = bucket + 5;
    return `${hour.toString().padStart(2, "0")}:${bucket
      .toString()
      .padStart(2, "0")} - ${hour.toString().padStart(2, "0")}:${end
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Activity Dashboard</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6 grid md:grid-cols-2 gap-4">
        <select
          className="border rounded px-3 py-2"
          value={selectedEmployee ?? ""}
          onChange={(e) => setSelectedEmployee(Number(e.target.value))}
        >
          <option value="">Select employee</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="border rounded px-3 py-2"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
        </div>
      )}

      {/* No data */}
      {!loading && !screenshotData && (
        <div className="bg-white p-10 text-center rounded shadow text-gray-500">
          No screenshots found for this date
        </div>
      )}

      {/* Data */}
      {!loading && screenshotData && (
        <>
          {/* Summary */}
          <div className="bg-white rounded shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {screenshotData.employee.name} — {screenshotData.date}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Stat
                label="Total"
                value={screenshotData.statistics.totalScreenshots}
                color="blue"
              />
              <Stat
                label="Hours Active"
                value={screenshotData.statistics.hoursActive}
                color="green"
              />
              <Stat
                label="First"
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
                label="Last"
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

          {/* Screenshots grouped */}
          {Object.entries(screenshotData.screenshots)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([hour, buckets]) => (
              <div key={hour} className="bg-white rounded shadow p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  Hour {hour.padStart(2, "0")}:00
                </h3>

                {Object.entries(buckets)
                  .sort(([a], [b]) => Number(a) - Number(b))
                  .map(([bucket, shots]) => (
                    <div key={bucket} className="mb-6">
                      <p className="text-sm font-medium mb-2 text-gray-700">
                        {formatTimeRange(Number(hour), Number(bucket))} (
                        {shots.length})
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {shots.map((s) => (
                          <div key={s.id} className="relative">
                            <img
                              src={s.filePath}
                              className="h-32 w-full object-cover rounded cursor-pointer"
                              onClick={() => window.open(s.filePath, "_blank")}
                            />
                            <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 text-center rounded-b">
                              {format(new Date(s.captureTime), "HH:mm:ss")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            ))}
        </>
      )}
    </div>
  );
};

/* Fixed Tailwind-safe Stat component */
const colorMap = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  purple: "bg-purple-50 text-purple-600",
  orange: "bg-orange-50 text-orange-600",
};

const Stat = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color: keyof typeof colorMap;
}) => (
  <div className={`p-4 rounded ${colorMap[color]}`}>
    <p className="text-sm opacity-70">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);
