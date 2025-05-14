import Image from "next/image";

interface Video {
  id: string;
  thumbnail: string;
  title: string;
}

const dummyVideos: Video[] = [
  {
    id: "1",
    thumbnail: "/car.jpeg",
    title: "Sample Video 1: Nature Exploration",
  },
  {
    id: "2",
    thumbnail: "/car.jpeg",
    title: "Sample Video 2: Tech Tutorial",
  },
  {
    id: "3",
    thumbnail: "/car.jpeg",
    title: "Sample Video 3: Cooking Masterclass",
  },
];

export default function History() {
  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white p-6">
      <h2 className="text-xl font-bold mb-4 text-white">Upload History</h2>
      {dummyVideos.length === 0 ? (
        <p className="text-sm text-gray-300">No videos uploaded yet.</p>
      ) : (
        <div className="space-y-2">
          {dummyVideos.map((video) => (
            <div
              key={video.id}
              className="bg-[#212121] hover:bg-[#272727] rounded-lg flex overflow-hidden"
            >
              <div className="relative w-40 h-24">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  width={160}
                  height={90}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2">
                <h4 className="font-medium text-sm text-white">
                  {video.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
