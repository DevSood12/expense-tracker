import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { formatCurrency } from '../../utils/formatCurrency.js';

// Chart.js is tree-shakable, so only the pieces we use are registered
ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  '#6366f1', '#22c55e', '#f59e0b', '#ef4444',
  '#06b6d4', '#a855f7', '#ec4899', '#84cc16',
];

const CategoryPieChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.category),
    datasets: [
      {
        data: data.map((item) => item.total),
        backgroundColor: COLORS,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${formatCurrency(ctx.parsed)}`,
        },
      },
    },
  };

  return (
    <div className="max-w-xs mx-auto">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default CategoryPieChart;