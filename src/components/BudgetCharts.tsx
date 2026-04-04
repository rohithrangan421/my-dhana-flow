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
    legend: { labels: { color: "hsl(220,20%,80%)", font: { size: 11, weight: 500 as const } } },
  },
};

const BudgetCharts = ({ data, totals }: Props) => {
  const { totalActual, remaining } = totals;

  const donutData = {
    labels: ["Spent", "Remaining"],
    datasets: [
      {
        data: [totalActual, Math.max(0, remaining)],
        backgroundColor: ["hsl(252,85%,63%)", "hsl(230,16%,20%)"],
        hoverBackgroundColor: ["hsl(252,85%,70%)", "hsl(230,16%,25%)"],
        borderWidth: 0,
        cutout: "72%",
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
          "hsl(252,85%,63%)",
          "hsl(190,90%,50%)",
          "hsl(155,75%,48%)",
          "hsl(40,95%,58%)",
        ],
        hoverBackgroundColor: [
          "hsl(252,85%,70%)",
          "hsl(190,90%,58%)",
          "hsl(155,75%,55%)",
          "hsl(40,95%,65%)",
        ],
        borderWidth: 0,
      },
    ],
  };

  const barColors = [
    "hsl(252,85%,63%)",
    "hsl(190,90%,50%)",
    "hsl(155,75%,48%)",
    "hsl(40,95%,58%)",
  ];
  const barColorsHover = [
    "hsl(252,85%,70%)",
    "hsl(190,90%,58%)",
    "hsl(155,75%,55%)",
    "hsl(40,95%,65%)",
  ];

  const barData = {
    labels: sections.map((s) => s.label),
    datasets: [
      {
        label: "Planned",
        data: sections.map((s) => s.items.reduce((sum, i) => sum + i.planned, 0)),
        backgroundColor: barColors.map((c) => c.replace(/\d+%\)$/, "30%)")),
        hoverBackgroundColor: barColors.map((c) => c.replace(/\d+%\)$/, "40%)")),
        borderRadius: 8,
      },
      {
        label: "Actual",
        data: sections.map((s) => s.items.reduce((sum, i) => sum + i.actual, 0)),
        backgroundColor: barColors,
        hoverBackgroundColor: barColorsHover,
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      x: {
        ticks: { color: "hsl(225,12%,50%)", font: { size: 10 }, maxRotation: 0, minRotation: 0 },
        grid: { display: false },
      },
      y: {
        ticks: { color: "hsl(225,12%,50%)", font: { size: 10 }, callback: (v: number) => v >= 1000 ? `${v / 1000}k` : v },
        grid: { color: "hsl(230,16%,16%)" },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gradient-to-br from-primary/10 to-card rounded-2xl p-5 shadow-xl border border-primary/15 animate-fade-in">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Spent vs Remaining</h3>
        <div className="h-48 flex items-center justify-center">
          <Doughnut data={donutData} options={chartOptions} />
        </div>
      </div>
      <div className="bg-gradient-to-br from-accent/10 to-card rounded-2xl p-5 shadow-xl border border-accent/15 animate-fade-in">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Allocation</h3>
        <div className="h-48 flex items-center justify-center">
          <Pie data={pieData} options={chartOptions} />
        </div>
      </div>
      <div className="bg-gradient-to-br from-success/10 to-card rounded-2xl p-5 shadow-xl border border-success/15 animate-fade-in">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Cash Flow</h3>
        <div className="h-48">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
};

export default BudgetCharts;
