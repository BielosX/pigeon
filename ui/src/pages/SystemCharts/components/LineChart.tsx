import { type RefObject, useEffect, useRef } from "react";
import { Chart } from "chart.js";

export interface ThermalChartDataset {
  label: string;
  data: number[];
}

export interface ThermalChartProps {
  labels: string[];
  datasets: ThermalChartDataset[];
}

export const LineChart = ({ labels, datasets }: ThermalChartProps) => {
  const canvasRef: RefObject<HTMLCanvasElement | null> = useRef(null);
  const chartRef: RefObject<Chart<"line"> | null> = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    chartRef.current?.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: labels,
        datasets,
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
    chartRef.current.data.datasets = datasets;
    chartRef.current.update();
  }, [labels, datasets]);

  return <canvas ref={canvasRef} />;
};
