import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, ArcElement, Title, Tooltip, Legend, Filler
)

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#94a3b8', font: { family: 'Inter' } } },
    tooltip: {
      backgroundColor: '#1e293b',
      titleColor: '#f1f5f9',
      bodyColor: '#94a3b8',
      borderColor: '#334155',
      borderWidth: 1
    }
  },
  scales: {
    x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(51,65,85,0.5)' } },
    y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(51,65,85,0.5)' } }
  }
}

export function BarChart({ data, options = {}, height = 300 }) {
  return (
    <div style={{ height }}>
      <Bar data={data} options={{ ...defaultOptions, ...options }} />
    </div>
  )
}

export function LineChart({ data, options = {}, height = 300 }) {
  return (
    <div style={{ height }}>
      <Line data={data} options={{ ...defaultOptions, ...options }} />
    </div>
  )
}

export function DoughnutChart({ data, options = {}, height = 300 }) {
  const noScaleOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: defaultOptions.plugins
  }
  return (
    <div style={{ height }}>
      <Doughnut data={data} options={{ ...noScaleOptions, ...options }} />
    </div>
  )
}
