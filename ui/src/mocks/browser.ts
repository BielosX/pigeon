import { http, HttpResponse } from "msw";
import { setupWorker } from "msw/browser";

export const handlers = [
  http.get("/api/v1/system-info", () => {
    return HttpResponse.json({
      kernelVersion: "6.18.34+rpt-rpi-2712",
      uptime: "40h18m57.45s",
      cpuByteOrder: "little",
      boardModel: "Raspberry Pi 5 Model B Rev 1.1",
      boardSerial: "9dc98f6d8a85114f",
      osRelease: "Debian GNU/Linux 13 (trixie)",
    });
  }),
  http.post("/api/v1/prometheus/query_range", () => {
    return HttpResponse.json({
      status: "success",
      data: {
        resultType: "matrix",
        result: [
          {
            metric: {
              __name__: "node_thermal_zone_temp",
              instance: "192.168.50.195:9100",
              job: "kubernetes-pods",
              type: "cpu-thermal",
              zone: "0",
            },
            values: [
              [1782855887.072, "57.85"],
              [1782855917.072, "56.2"],
              [1782855947.072, "56.75"],
              [1782855977.072, "55.1"],
              [1782856007.072, "55.65"],
              [1782856037.072, "56.2"],
              [1782856067.072, "56.2"],
              [1782856097.072, "55.65"],
              [1782856127.072, "55.1"],
              [1782856157.072, "55.1"],
              [1782856187.072, "55.65"],
            ],
          },
        ],
      },
    });
  }),
];

export const worker = setupWorker(...handlers);
