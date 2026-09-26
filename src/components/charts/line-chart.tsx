"use client";

import { useEffect, useRef } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
} from "chart.js";
import { useChartColors } from "@/lib/colors";

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend, Filler);

interface LineChartProps {
  labels: string[];
  datasets: Array<{
    label: string;
    data: (number | null)[];
    borderColor: string;
    backgroundColor?: string;
    fill?: boolean;
    tension?: number;
    borderWidth?: number;
    pointRadius?: number;
  }>;
  height?: number;
}

export function LineChart({ labels, datasets, height = 200 }: LineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const colors = useChartColors();

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: colors.tooltipBg,
            borderColor: colors.tooltipBorder,
            borderWidth: 1,
            titleColor: colors.tooltipTitle,
            bodyColor: colors.tooltipBody,
            padding: 10,
          },
        },
        scales: {
          x: {
            grid: { color: colors.grid },
            ticks: { color: colors.ticks, maxTicksLimit: 8, font: { size: 10 } },
          },
          y: {
            grid: { color: colors.grid },
            ticks: { color: colors.ticks, font: { size: 10 } },
          },
        },
      } as ChartOptions<"line">,
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [labels, datasets, colors]);

  return (
    <div style={{ height }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
