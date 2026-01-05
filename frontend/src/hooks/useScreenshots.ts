import { useState, useEffect } from "react";
import { screenshotService } from "../services/screenshotService";
import type { ScreenshotGroupedResponse } from "../types";

export const useScreenshots = (employeeId: number | null, date: string) => {
  const [screenshots, setScreenshots] =
    useState<ScreenshotGroupedResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!employeeId || !date) {
      setScreenshots(null);
      setNotFound(true);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setNotFound(false);
        const data = await screenshotService.getGroupedScreenshots(
          employeeId,
          date
        );
        setScreenshots(data);
      } catch (err) {
        console.error("Failed to load screenshots:", err);
        setNotFound(true);
        setScreenshots(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [employeeId, date]);

  return { screenshots, loading };
};
