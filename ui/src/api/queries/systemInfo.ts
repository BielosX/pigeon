export interface SystemInfo {
  kernelVersion: string;
  uptime: string;
  cpuByteOrder: string;
  boardModel: string;
  boardSerial: string;
  osRelease: string;
}

export const getSystemInfo = async (token: string): Promise<SystemInfo> => {
  const response = await fetch("/api/v1/system-info", {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    return Promise.reject();
  }
  return await response.json();
};
