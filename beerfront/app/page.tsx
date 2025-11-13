import Link from "next/link";
import { ArrowRightIcon, PlayIcon } from "@heroicons/react/24/outline";
import type { Video } from "./lib/definitions";

async function getVideos(): Promise<Video[]> {
  try {
    const response = await fetch("http://localhost:8000/api/videos", {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    return response.json();
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    return [];
  }
}

export default async function Page() {
  const videos = await getVideos();

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 md:text-6xl mb-4">
            ilia.beer
          </h1>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Upload Video
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>

        {/* Videos Grid */}
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-video bg-gray-900 flex items-center justify-center group">
                  <video
                    src={video.url}
                    className="w-full h-full object-cover"
                    controls
                    preload="metadata"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <PlayIcon className="h-16 w-16 text-white" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2">
                    {video.caption || "Untitled Video"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(video.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No videos yet. Upload your first video!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
