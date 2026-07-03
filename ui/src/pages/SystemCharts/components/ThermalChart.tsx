import { type RefObject, useEffect, useRef } from "react";
import { Chart } from "chart.js";

export interface ThermalChartProps {
  labels: string[];
  data: number[];
}

export const ThermalChart = ({ labels, data }: ThermalChartProps) => {
  const canvasRef: RefObject<HTMLCanvasElement | null> = useRef(null);
  const chartRef: RefObject<Chart<"line"> | null> = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    chartRef.current?.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Cpu temperature",
            data: data,
          },
        ],
      },
    });
    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    chartRef.current.data.labels = labels;
    chartRef.current.data.datasets[0].data = data;
    chartRef.current.update();
  }, [labels, data]);

  return <canvas ref={canvasRef} />;
};
