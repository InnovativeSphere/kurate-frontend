'use client';

import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface TopProductsChartProps {
  products: Array<{ product_name: string; total_views: number }>;
}

export function TopProductsChart({ products }: TopProductsChartProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [chartOptions, setChartOptions] = useState<any>(null);
  const [series, setSeries] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    const isDark = resolvedTheme === 'dark';
    
    setChartOptions({
      chart: {
        type: 'bar',
        toolbar: { show: false },
        fontFamily: 'var(--font-dm-sans), sans-serif',
        background: 'transparent',
      },
      plotOptions: {
        bar: {
          borderRadius: 8,
          horizontal: true,
          barHeight: '60%',
          distributed: false,
        },
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: products.map((p) => p.product_name),
        labels: { 
          style: { 
            colors: isDark ? '#A89EC8' : '#4B5170',
            fontSize: '11px',
          },
          trim: true,
          maxHeight: 60,
        },
        title: { text: 'Total Views', style: { color: isDark ? '#A89EC8' : '#4B5170' } },
      },
      yaxis: {
        labels: { 
          style: { 
            colors: isDark ? '#A89EC8' : '#4B5170',
            fontSize: '12px',
          },
        },
      },
      grid: { 
        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        strokeDashArray: 4,
      },
      tooltip: { 
        theme: isDark ? 'dark' : 'light',
        y: { formatter: (val: number) => `${val} views` },
      },
      colors: ['#7B5FFF'],
    });
    
    setSeries([{ name: 'Total Views', data: products.map((p) => p.total_views) }]);
  }, [resolvedTheme, products]);

  if (!mounted) {
    return <div className="h-80 w-full animate-pulse rounded-lg bg-gray-200/20" />;
  }

  return (
    <ReactApexChart 
      options={chartOptions} 
      series={series} 
      type="bar" 
      height={400} 
      width="100%"
    />
  );
}