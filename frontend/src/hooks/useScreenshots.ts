import { useState, useEffect } from "react";
import { screenshotService } from "../services/screenshotService";
import type { ScreenshotGroupedResponse } from "../types";

export const useScreenshots = (employeeId: number | null, date: string) => {
  const [screenshots, setScreenshots] =
    useState<ScreenshotGroupedResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!employeeId || !date) return;

    const load = async () => {
      try {
        setLoading(true);
        const data = await screenshotService.getGroupedScreenshots(
          employeeId,
          date
        );
        setScreenshots(data);
      } catch (err) {
        console.error("Failed to load screenshots:", err);
        setScreenshots(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [employeeId, date]);

  return { screenshots, loading };
};
