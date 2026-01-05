import type { ScreenshotGroupedResponse } from "../types";

export const ScreenshotGrid = ({
  data,
  formatTime,
}: {
  data: ScreenshotGroupedResponse;
  formatTime: (hour: number, bucket: number) => string;
}) => (
  <div className="space-y-6">
    {Object.entries(data.screenshots)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([hour, buckets]) => (
        <div key={hour} className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            Hour: {hour.padStart(2, "0")}:00
          </h3>
          {Object.entries(buckets)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([bucket, screenshots]) => (
              <div
                key={bucket}
                className="border-l-4 border-blue-500 pl-4 mb-4"
              >
                <p className="text-sm font-medium mb-2">
                  {formatTime(Number(hour), Number(bucket))} (
                  {screenshots.length} screenshot
                  {screenshots.length !== 1 ? "s" : ""})
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {screenshots.map((s) => (
                    <div key={s.id} className="relative">
                      <img
                        src={s.filePath}
                        className="w-full h-32 object-cover rounded cursor-pointer"
                        onClick={() => window.open(s.filePath, "_blank")}
                      />
                      <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 text-center rounded-b">
                        {new Date(s.captureTime).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      ))}
  </div>
);
