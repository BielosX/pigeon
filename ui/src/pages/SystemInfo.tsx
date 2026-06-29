import { useSystemInfo } from "../api/hooks/useSystemInfo.ts";
import { RefreshCw } from "lucide-react";
import { toast } from "react-toastify";

export const SystemInfo = () => {
  const { data, isFetching, refetch } = useSystemInfo();

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.info("System Info refreshed");
    } catch {
      toast.error("Unable to refresh system info");
    }
  };

  if (isFetching) {
    return <span className="loading loading-spinner text-primary" />;
  }

  return (
    <div className="flex flex-col items-start">
      <div className="btn btn-ghost self-end">
        <RefreshCw onClick={handleRefresh} />
      </div>
      <div className="grid grid-flow-row grid-cols-2 gap-y-0 gap-x-2">
        <span>Kernel Version: </span>
        <span>{data?.kernelVersion}</span>
        <span>Uptime: </span>
        <span>{data?.uptime}</span>
        <span>Cpu Byte Order: </span>
        <span>{data?.cpuByteOrder}</span>
        <span>Board Model: </span>
        <span>{data?.boardModel}</span>
        <span>Board Serial: </span>
        <span>{data?.boardSerial}</span>
        <span>Os Release: </span>
        <span>{data?.osRelease}</span>
      </div>
    </div>
  );
};
