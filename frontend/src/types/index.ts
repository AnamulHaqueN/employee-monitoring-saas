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
}

export interface Screenshot {
  id: number;
  filePath: string;
  captureTime: string;
  userId: number;
  companyId: number;
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

export interface ScreenshotGroupedResponse {
  employee: {
    id: number;
    name: string;
    email: string;
  };
  date: string;
  statistics: {
    totalScreenshots: number;
    hoursActive: number;
    firstScreenshot: string | null;
    lastScreenshot: string | null;
  };
  screenshots: GroupedScreenshots;
}
