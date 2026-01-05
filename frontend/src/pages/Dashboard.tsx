import { useEffect, useState } from "react";
import { useEmployeeFilter } from "../hooks/useEmployeeFilter";
import { useEmployees } from "../hooks/useEmployees";
import { useScreenshots } from "../hooks/useScreenshots";
import { format } from "date-fns";
import { EmployeeSelect } from "./EmployeeSelect";
import { ScreenshotGrid } from "./ScreenshotGuid";
import { AllScreenshots } from "./AllScreenshot";

export const Dashboard = () => {
  const { employees, loading: employeesLoading } = useEmployees();
  const { searchTerm, setSearchTerm, filtered } = useEmployeeFilter(employees);

  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);

  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );

  useEffect(() => {
    if (filtered.length === 0) {
      setSelectedEmployee(null);
      return;
    }

    if (!filtered.some((e) => e.id === selectedEmployee)) {
      setSelectedEmployee(filtered[0].id);
    }
  }, [filtered]);

  const { screenshots, loading: screenshotsLoading } = useScreenshots(
    selectedEmployee,
    selectedDate
  );

  const formatTime = (hour: number, bucket: number) => {
    const end = bucket + 5;
    return `${hour.toString().padStart(2, "0")}:${bucket
      .toString()
      .padStart(2, "0")} - ${hour.toString().padStart(2, "0")}:${end
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Activity Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <EmployeeSelect
          employees={filtered}
          value={selectedEmployee}
          onSelect={setSelectedEmployee}
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
        />

        <div>
          <label className="block text-sm font-medium mb-2">Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={format(new Date(), "yyyy-MM-dd")}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {screenshotsLoading ? (
        <p>Loading screenshots...</p>
      ) : screenshots ? (
        <ScreenshotGrid data={screenshots} formatTime={formatTime} />
      ) : (
        <div>
          <p>No Screenshot is found</p>

          <AllScreenshots />
        </div>
      )}
    </div>
  );
};
