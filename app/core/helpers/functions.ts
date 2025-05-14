export function base64ToBlob(base64DataUrl: string): Blob {
    if (!base64DataUrl.includes(",")) {
      throw new Error("Invalid base64 data URL.");
    }
  
    const [meta, base64] = base64DataUrl.split(",");
  
    try {
      const byteCharacters = atob(base64); // decode base64 safely
      const byteArrays = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays[i] = byteCharacters.charCodeAt(i);
      }
  
      const contentType = meta.match(/data:(.*);base64/)?.[1] || "image/jpeg";
      return new Blob([byteArrays], { type: contentType });
    } catch (e) {
      console.error("⚠️ Invalid base64 content:", base64DataUrl);
      throw e;
    }
  }