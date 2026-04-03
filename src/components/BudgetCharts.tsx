import { Doughnut, Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import type { MonthData } from "@/lib/budgetData";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface Props {
  data: MonthData;
  totals: { totalPlanned: number; totalActual: number; remaining: number };
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: "hsl(210,20%,85%)", font: { size: 11 } } },
  },
};

const BudgetCharts = ({ data, totals }: Props) => {
  const { totalActual, remaining } = totals;

  const donutData = {
    labels: ["Spent", "Remaining"],
    datasets: [
      {
        data: [totalActual, Math.max(0, remaining)],
        backgroundColor: ["hsl(168,70%,45%)", "hsl(220,14%,20%)"],
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  };

  const sections = [
    { label: "Bills", items: data.bills },
    { label: "Expenses", items: data.expenses },
    { label: "Savings", items: data.savings },
    { label: "Investments", items: data.investments },
  ];

  const pieData = {
    labels: sections.map((s) => s.label),
    datasets: [
      {
        data: sections.map((s) => s.items.reduce((sum, i) => sum + i.actual, 0)),
        backgroundColor: [
          "hsl(168,70%,45%)",
          "hsl(200,70%,50%)",
          "hsl(142,60%,45%)",
          "hsl(45,90%,55%)",
        ],
        borderWidth: 0,
      },
    ],
  };

  const barData = {
    labels: sections.map((s) => s.label),
    datasets: [
      {
        label: "Planned",
        data: sections.map((s) => s.items.reduce((sum, i) => sum + i.planned, 0)),
        backgroundColor: "hsl(220,14%,25%)",
        borderRadius: 6,
      },
      {
        label: "Actual",
        data: sections.map((s) => s.items.reduce((sum, i) => sum + i.actual, 0)),
        backgroundColor: "hsl(168,70%,45%)",
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      x: { ticks: { color: "hsl(210,20%,55%)" }, grid: { display: false } },
      y: { ticks: { color: "hsl(210,20%,55%)" }, grid: { color: "hsl(220,14%,18%)" } },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-card rounded-xl p-5 shadow-lg border border-border">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Spent vs Remaining</h3>
        <div className="h-48 flex items-center justify-center">
          <Doughnut data={donutData} options={chartOptions} />
        </div>
      </div>
      <div className="bg-card rounded-xl p-5 shadow-lg border border-border">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Allocation</h3>
        <div className="h-48 flex items-center justify-center">
          <Pie data={pieData} options={chartOptions} />
        </div>
      </div>
      <div className="bg-card rounded-xl p-5 shadow-lg border border-border">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Cash Flow</h3>
        <div className="h-48">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
};

export default BudgetCharts;
