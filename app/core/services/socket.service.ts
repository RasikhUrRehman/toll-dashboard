export let socket: WebSocket | null = null;

export const connectSocket = (): Promise<WebSocket> => {
    return new Promise((resolve, reject) => {
      let url = `wss://b9nbr0kl-8000.inc1.devtunnels.ms/ws`
      url =  `ws://127.0.0.1:8000/ws`
      const SOCKET_URL = url
      socket = new WebSocket(SOCKET_URL);
      
  
      socket.onopen = () => {
        console.log("✅ WebSocket connected");
        resolve(socket!);
      };
  
      socket.onerror = (error) => {
        console.error("❌ WebSocket error", error);
        reject(error);
      };
    });
  };

  
  
  
  