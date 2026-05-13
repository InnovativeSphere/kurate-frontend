'use client';

import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { TechLoader } from '../components/TechLoader'; // 👈 added

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ViewsChartProps {
  data: Array<{ date: string; count: number }>;
  title: string;
}

export function ViewsChart({ data, title }: ViewsChartProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [chartOptions, setChartOptions] = useState<any>(null);
  const [series, setSeries] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    const isDark = resolvedTheme === 'dark';

    setChartOptions({
      chart: {
        type: 'area',
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: 'var(--font-dm-sans), sans-serif',
        background: 'transparent',
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2 },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 0.5,
          opacityFrom: 0.3,
          opacityTo: 0.05,
        },
      },
      xaxis: {
        categories: data.map((d) => d.date),
        labels: {
          style: {
            colors: isDark ? '#A89EC8' : '#4B5170',
            fontSize: '11px',
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          style: {
            colors: isDark ? '#A89EC8' : '#4B5170',
            fontSize: '11px',
          },
        },
        title: { text: 'Views', style: { color: isDark ? '#A89EC8' : '#4B5170' } },
      },
      grid: {
        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        strokeDashArray: 4,
      },
      tooltip: {
        theme: isDark ? 'dark' : 'light',
        y: { formatter: (val: number) => `${val} views` },
      },
      colors: ['#4F9EFF'],
    });

    setSeries([{ name: title, data: data.map((d) => d.count) }]);
  }, [resolvedTheme, data, title]);

  if (!mounted) {
    return <TechLoader text="Loading chart..." />;
  }

  return (
    <ReactApexChart
      options={chartOptions}
      series={series}
      type="area"
      height={320}
      width="100%"
    />
  );
}