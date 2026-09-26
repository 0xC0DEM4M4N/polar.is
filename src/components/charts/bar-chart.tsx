"use client";

import { useEffect, useRef } from "react";
import {
  Chart,
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { useChartColors } from "@/lib/colors";

Chart.register(BarController, BarElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

interface BarChartProps {
  labels: string[];
  datasets: Array<{
    label: string;
    data: (number | null)[];
    backgroundColor: string;
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
  }>;
  height?: number;
}

export function BarChart({ labels, datasets, height = 200 }: BarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const colors = useChartColors();

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
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
      } as ChartOptions<"bar">,
    });

    return () => { chartRef.current?.destroy(); };
  }, [labels, datasets, colors]);

  return <div style={{ height }}><canvas ref={canvasRef} /></div>;
}
