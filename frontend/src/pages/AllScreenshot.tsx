import { useEffect, useState } from "react";
import { screenshotService } from "../services/screenshotService";

export const AllScreenshots = () => {
  const [screenshots, setScreenshots] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchScreenshots = async () => {
      try {
        setLoading(true);
        const res = await screenshotService.getScreenshots({ page });
        setScreenshots(res.data);
        setLastPage(res.meta.lastPage);
      } catch (error) {
        console.error("Failed to load screenshots", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScreenshots();
  }, [page]);

  {
    /* Show all the image */
  }
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Screenshots</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : screenshots.length === 0 ? (
        <p className="text-center text-gray-500">No screenshots found</p>
      ) : (
        <>
          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {screenshots.map((s) => (
              <div
                key={s.id}
                className="relative overflow-hidden rounded-lg border bg-white shadow-sm"
              >
                <img
                  src={s.filePath}
                  className="h-32 w-full object-cover cursor-pointer"
                  onClick={() => window.open(s.filePath, "_blank")}
                />
                <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1 text-center">
                  {s.user.name} – {new Date(s.captureTime).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 rounded border bg-white disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-4 py-2 rounded border ${
                  page === p
                    ? "bg-blue-600 text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              disabled={page === lastPage}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 rounded border bg-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};
