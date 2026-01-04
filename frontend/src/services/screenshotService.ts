import api from "../config/axios";
import type { ScreenshotGroupedResponse } from "../types";

export const screenshotService = {
  async upload(screenshot: File, captureTime: Date) {
    const formData = new FormData();
    formData.append("screenshot", screenshot);
    formData.append("captureTime", captureTime.toISOString());

    const response = await api.post("/screenshots", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async getScreenshots(params: {
    employeeId?: number;
    date?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await api.get("/screenshots", { params });
    return response.data.data;
  },

  async getGroupedScreenshots(
    employeeId: number,
    date: string
  ): Promise<ScreenshotGroupedResponse> {
    const response = await api.get("/screenshots/grouped", {
      params: { employeeId, date },
    });
    return response.data;
  },

  async getByHour(employeeId: number, date: string, hour: number) {
    const response = await api.get("/screenshots/by-hour", {
      params: { employeeId, date, hour },
    });
    return response.data.data;
  },

  async deleteScreenshot(id: number) {
    const response = await api.delete(`/screenshots/${id}`);
    return response.data;
  },

  async getStatistics(employeeId: number, startDate: string, endDate: string) {
    const response = await api.get("/screenshots/statistics", {
      params: { employeeId, startDate, endDate },
    });
    return response.data.data;
  },
};
