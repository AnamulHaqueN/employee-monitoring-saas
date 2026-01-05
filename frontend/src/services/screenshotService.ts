import api from "../config/axios";
import type { ScreenshotGroupedResponse, ScreenshotResponse } from "../types";

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
  }): Promise<ScreenshotResponse> {
    const { data } = await api.get("/screenshots", { params });
    return data.data;
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
};
