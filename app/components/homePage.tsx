"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Video {
  id: string;
  file: File;
  thumbnail: string;
  title: string;
}

export default function YouTubeUI() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [videos, setVideos] = useState<Video[]>([]);
  const router = useRouter();

  // Handle video upload
  const handleVideoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      const thumbnail = await generateThumbnail(file);
      const newVideo: Video = {
        id: crypto.randomUUID(),
        file,
        thumbnail,
        title: file.name,
      };
      setVideos((prev) => [...prev, newVideo]);
      console.log("Uploaded video:", newVideo);
    }
  };

  // Generate thumbnail from video
  const generateThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.src = URL.createObjectURL(file);
      video.currentTime = 1;
      video.onloadeddata = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 160;
        canvas.height = 90;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, 160, 90);
          resolve(canvas.toDataURL("image/jpeg"));
        } else {
          resolve("/car.jpeg");
        }
        URL.revokeObjectURL(video.src);
      };
      video.onerror = () => resolve("/car.jpeg");
    });
  };

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6 bg-[#0f0f0f] sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <label className="p-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-black cursor-pointer">
            <span className="font-normal px-6 text-lg">Upload</span>
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleVideoUpload}
            />
          </label>
          <button
            className="p-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-black"
            onClick={() => router.push("/history")}
          >
            <span className="font-normal px-6 text-lg">History</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex px-6 py-2">
        {/* Main Video Column */}
        <div className="flex-1 mr-4">
          {/* Main Video */}
          <div className="rounded-lg overflow-hidden bg-black mb-4">
            <Image
              src="/car.jpeg"
              alt="Stream Banner Template"
              width={850}
              height={480}
              className="w-full"
            />
          </div>

          {/* Video Title */}
          <h1 className="text-2xl font-bold mb-2 text-white">
            How to Design Live Streaming Banner Overlay (Photoshop Tutorial)
          </h1>

          {/* Description */}
          <div className="bg-[#272727] p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-300 mb-2">
              Description of your epic video goes here. Now I am going back to
              the Lorem Ipsum text placeholder.
            </p>
            <p className="text-sm text-gray-300 mb-2">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry&apos;s standard dummy
              text ever since the 1500s.
            </p>
            <p className="text-sm text-gray-300">
              When an unknown printer took a galley of type and scrambled it to
              make a type specimen book. It has survived not only five
              centuries, but also the leap into electronic typesetting,
              remaining essentially unchanged. It was popularised in the 1960s
              with the release of Letraset sheets containing Lorem Ipsum
              passages.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-96">
          {/* Related Videos */}
          <div className="space-y-2">
            {[1].map((index) => (
              <div
                key={index}
                className="bg-[#212121] hover:bg-[#272727] rounded-lg flex overflow-hidden"
              >
                <div className="relative w-40 h-24">
                  <Image
                    src="/car.jpeg"
                    alt="Video thumbnail"
                    width={160}
                    height={90}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2">
                  <h4 className="font-medium text-sm text-white">
                    How to earn money while dancing. Earned 50K$ (Click me)
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
