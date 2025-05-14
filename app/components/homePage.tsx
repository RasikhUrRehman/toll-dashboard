"use client";
import { useState,useEffect } from "react";
import Image from "next/image";
import { connectSocket,socket } from "../core/services/socket.service";
import { UploadIcon } from "lucide-react";
import { LoaderCircle } from "lucide-react";
import { base64ToBlob } from "../core/helpers/functions";
interface IncomingData{
  current_total_toll: number;
  current_total_vehicles: number;
  frame_vehicle_toll:number[];
  processed_frame:string;
  vehicle_counts:{
    bus:number;
    car:number;
    motorbike:number;
    truck:number;
  }
}
export default function YouTubeUI() {
  const [data,setData] = useState<IncomingData>({
    current_total_toll: 0,
  current_total_vehicles: 0,
  frame_vehicle_toll:[],
  processed_frame:"",
  vehicle_counts:{
    bus:0,
    car:0,
    motorbike:0,
    truck:0,
  }
  })
  const [videoEnd,setVideoEnd] = useState<boolean>(false)
  const[loading,setLoading] = useState<boolean>(false)
   const sendVideoFrames = async (file: File): Promise<void> => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      try {
        const result = await connectSocket();
        if (result) {
          return sendVideoFrames(file);
        }
      } catch (err) {
        console.error("❌ Failed to connect before sending frames:", err);
        return;
      }
    }
  
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
  
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
  
    video.addEventListener("loadeddata", () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
  
      const fps = 2;
      const interval = 1 / fps;
      const duration = video.duration;
      let currentTime = 0;
  
      const sendNextFrame = () => {
        if (currentTime >= duration) {
          setVideoEnd(true)
          console.log("✅ All frames sent");
          
          URL.revokeObjectURL(video.src);
          return;
        }
  
        video.currentTime = currentTime;
      };
  
      video.addEventListener("seeked", () => {
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64Image = canvas.toDataURL("image/jpeg", 0.7);
  
        if (socket && socket.readyState === WebSocket.OPEN) {

          socket.send(JSON.stringify({ frame: base64Image }));
          console.log(`📤 Sent frame at ${currentTime.toFixed(2)}s`);
        }
      });
  
      // Message listener to send next frame after receiving a response
      socket!.onmessage = (event) => {
        setLoading(false)
        try {
          
          const data: IncomingData = JSON.parse(event.data);
          const dataUrl = `data:image/jpeg;base64,${data.processed_frame}`;
          const blob = base64ToBlob(dataUrl);
          const url = URL.createObjectURL(blob);
          setData({ ...data, processed_frame: url });
          console.log(data,"data",currentTime,interval)
          currentTime += interval;
          sendNextFrame(); // send next frame after response
        } catch (e) {
          console.error("Error handling message:", e);
        }
      };
  
      sendNextFrame();
    });
  };
  // Handle video upload
  const handleVideoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true)
      setVideoEnd(false)
      sendVideoFrames(file);
    }
    
  };
 
  // UseEffect to connect to WebSocket and listen for incoming messages
  useEffect(() => {
    let ws: WebSocket;

    connectSocket().then((socket) => {
      ws = socket;
    });
    return () => {
      if (ws) {
        ws.close();
        console.log("🔌 WebSocket connection closed");
      }
    };
  }, []);
  return (
    <div className="bg-light-ivory min-h-screen  px-6 pt-5 grid grid-cols-3 gap-5">
      <div className="col-span-2 relative rounded-lg bg-black mb-4 w-full h-[680px] overflow-hidden">
     
            {videoEnd && <label className="text-white absolute top-[20px] left-[20px] z-30 w-[50px] h-[50px] cursor-pointer bg-black flex justify-center items-center rounded-[50px]">
           <UploadIcon color="white" size={20} />
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleVideoUpload}
          />
        </label>}
            
            {data?.processed_frame?.length>0&&!loading?
          <Image
          src={data?.processed_frame }
          alt="Stream Banner Template"
          className="w-full z-[1]"
          fill
        />:<div className="w-full h-full justify-center items-center flex">
          {loading?<LoaderCircle color="white" size={48} className="custom-spin"/>:
          <label className="p-2 text-white cursor-pointer">
           <UploadIcon color="white" size={48} />
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleVideoUpload}
          />
        </label>
         }
        </div>
          }
            
          </div>
      <div className="flex flex-col gap-5 text-black w-full ">
      <div
              className="shadow-box bg-gray flex gap-1 w-full rounded-2xl p-[30px]"
            >
              <h3 className="text-lg font-bold">Total Toll:</h3>
              <span className="text-lg">{data?.current_total_toll}</span>
              
            </div>
            <div
              className="shadow-box bg-gray flex gap-1 w-full rounded-2xl p-[30px]"
            >
              <h3 className="text-lg font-bold">Total Vehicles:</h3>
              <span className="text-lg">{data?.current_total_vehicles}</span>
              
            </div>
            <div
              className="shadow-box bg-gray flex gap-1 w-full rounded-2xl p-[30px]"
            >
              <h3 className="text-lg font-bold">Frame Vehicle Tol:</h3>
              <span className="text-lg">{data?.frame_vehicle_toll[0] ||0}</span>
              
            </div>
            <div
              className="shadow-box bg-gray flex flex-col gap-1 w-full rounded-2xl p-[30px]"
            >
              <h3 className="text-lg font-bold">Vehicle Counts</h3>
              <div className="flex flex-col ">
              <span className="text-base">Bus: {data?.vehicle_counts?.bus ||0}</span>
              <span className="text-base">Car: {data?.vehicle_counts?.car ||0}</span>
              <span className="text-base">Bike: {data?.vehicle_counts?.motorbike ||0}</span>
              <span className="text-base">Truck: {data?.vehicle_counts?.truck ||0}</span>
              </div>
              
            </div>
      </div>
    </div>
  );
}
