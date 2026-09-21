import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
};

interface RiskTrendChartProps {
  labels: string[];
  green: number[];
  yellow: number[];
  red: number[];
}

export function RiskTrendChart({ labels, green, yellow, red }: RiskTrendChartProps) {
  return (
    <div className="h-96">
      <Line
        data={{
          labels,
          datasets: [
            { 
              label: 'Low Risk (Green)', 
              data: green, 
              borderColor: '#10b981', 
              backgroundColor: 'rgba(16,185,129,0.1)', 
              fill: true, 
              tension: 0.4,
              borderWidth: 3,
              pointBackgroundColor: '#ffffff',
              pointBorderColor: '#10b981',
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
            { 
              label: 'Medium Risk (Yellow)', 
              data: yellow, 
              borderColor: '#f59e0b', 
              backgroundColor: 'rgba(245,158,11,0.1)', 
              fill: true, 
              tension: 0.4,
              borderWidth: 3,
              pointBackgroundColor: '#ffffff',
              pointBorderColor: '#f59e0b',
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
            { 
              label: 'High Risk (Red)', 
              data: red, 
              borderColor: '#ef4444', 
              backgroundColor: 'rgba(239,68,68,0.1)', 
              fill: true, 
              tension: 0.4,
              borderWidth: 3,
              pointBackgroundColor: '#ffffff',
              pointBorderColor: '#ef4444',
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        }}
        options={{
          ...chartDefaults,
          interaction: { mode: 'index', intersect: false },
          plugins: { 
            legend: { 
              display: true, 
              position: 'bottom',
              labels: {
                usePointStyle: true,
                padding: 20,
                font: { family: 'Inter, sans-serif', weight: 'bold' }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              titleColor: '#1f2937',
              bodyColor: '#4b5563',
              borderColor: '#e5e7eb',
              borderWidth: 1,
              padding: 12,
              boxPadding: 4,
              usePointStyle: true,
            }
          },
          scales: { 
            x: { 
              grid: { display: false },
              ticks: { font: { family: 'Inter, sans-serif' }, color: '#6b7280' }
            },
            y: { 
              beginAtZero: true,
              grid: { color: 'rgba(0, 0, 0, 0.04)' },
              border: { dash: [4, 4] },
              ticks: { font: { family: 'Inter, sans-serif' }, color: '#6b7280' }
            } 
          },
        }}
      />
    </div>
  );
}

interface RiskDistributionChartProps {
  green: number;
  yellow: number;
  red: number;
}

export function RiskDistributionChart({ green, yellow, red }: RiskDistributionChartProps) {
  return (
    <div className="mx-auto h-80 w-80">
      <Doughnut
        data={{
          labels: ['Low Risk', 'Medium Risk', 'High Risk'],
          datasets: [{
            data: [green, yellow, red],
            backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
            hoverBackgroundColor: ['#059669', '#d97706', '#dc2626'],
            borderWidth: 3,
            borderColor: '#ffffff',
            hoverOffset: 8,
          }],
        }}
        options={{
          ...chartDefaults,
          plugins: { 
            legend: { 
              display: true, 
              position: 'bottom',
              labels: {
                usePointStyle: true,
                padding: 20,
                font: { family: 'Inter, sans-serif', weight: 'bold' }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              titleColor: '#1f2937',
              bodyColor: '#4b5563',
              borderColor: '#e5e7eb',
              borderWidth: 1,
              padding: 12,
              boxPadding: 4,
              usePointStyle: true,
            }
          },
          cutout: '70%',
        }}
      />
    </div>
  );
}

interface RiskProgressionChartProps {
  weeks: number[];
  scores: number[];
}

export function RiskProgressionChart({ weeks, scores }: RiskProgressionChartProps) {
  return (
    <div className="h-56">
      <Line
        data={{
          labels: weeks.map(w => `W${w}`),
          datasets: [{
            label: 'Risk Score',
            data: scores,
            borderColor: '#ec4899',
            backgroundColor: 'rgba(236,72,153,0.15)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: scores.map(s => s >= 70 ? '#ef4444' : s >= 40 ? '#f59e0b' : '#10b981'),
          }],
        }}
        options={{
          ...chartDefaults,
          scales: {
            y: { beginAtZero: true, max: 100 },
          },
        }}
      />
    </div>
  );
}

interface VillageHeatmapChartProps {
  villages: { name: string; red: number; yellow: number; green: number }[];
}

export function VillageRiskBarChart({ villages }: VillageHeatmapChartProps) {
  return (
    <div className="h-72">
      <Bar
        data={{
          labels: villages.map(v => v.name),
          datasets: [
            { label: 'High Risk', data: villages.map(v => v.red), backgroundColor: '#ef4444', borderRadius: 6 },
            { label: 'Medium Risk', data: villages.map(v => v.yellow), backgroundColor: '#f59e0b', borderRadius: 6 },
            { label: 'Low Risk', data: villages.map(v => v.green), backgroundColor: '#10b981', borderRadius: 6 },
          ],
        }}
        options={{
          ...chartDefaults,
          plugins: { legend: { display: true, position: 'bottom' } },
          scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } },
        }}
      />
    </div>
  );
}
