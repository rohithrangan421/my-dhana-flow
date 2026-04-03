import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import {
  type MonthData,
  loadMonth,
  saveMonth,
  resetMonth,
  exportAllData,
  importData,
  getMonthName,
  calcTotals,
  loadSalary,
  saveSalary,
} from "@/lib/budgetData";
import BudgetTable from "@/components/BudgetTable";
import SummaryCards from "@/components/SummaryCards";
import BudgetCharts from "@/components/BudgetCharts";
import SavingsGoals from "@/components/SavingsGoals";
import SalarySection from "@/components/SalarySection";
import { ChevronLeft, ChevronRight, RotateCcw, Download, Upload } from "lucide-react";

const Index = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [data, setData] = useState<MonthData>(() => loadMonth(year, month));
  const [salary, setSalary] = useState(() => loadSalary(year, month));
  const fileRef = useRef<HTMLInputElement>(null);

  const persist = useCallback(
    (newData: MonthData) => {
      setData(newData);
      saveMonth(year, month, newData);
    },
    [year, month]
  );

  const navigate = (dir: -1 | 1) => {
    let m = month + dir;
    let y = year;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setMonth(m);
    setYear(y);
    setData(loadMonth(y, m));
    setSalary(loadSalary(y, m));
  };

  const handleSalaryChange = (val: number) => {
    setSalary(val);
    saveSalary(year, month, val);
    toast.success("Salary updated!", { duration: 1500 });
  };

  const updateSection = (section: keyof MonthData, idx: number, field: "planned" | "actual", value: number) => {
    const newData = { ...data, [section]: data[section].map((item, i) => (i === idx ? { ...item, [field]: value } : item)) };
    persist(newData);
    toast.success("Updated!", { duration: 1500 });
  };

  const addItem = (section: keyof MonthData, category: string) => {
    const newData = { ...data, [section]: [...data[section], { category, planned: 0, actual: 0 }] };
    persist(newData);
    toast.success(`Added "${category}"`, { duration: 1500 });
  };

  const removeItem = (section: keyof MonthData, idx: number) => {
    const newData = { ...data, [section]: data[section].filter((_, i) => i !== idx) };
    persist(newData);
    toast.info("Category removed", { duration: 1500 });
  };

  const handleReset = () => {
    resetMonth(year, month);
    const fresh = loadMonth(year, month);
    setData(fresh);
    toast.info("Month data reset");
  };

  const handleExport = () => {
    const blob = new Blob([exportAllData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "budget_data.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported!");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importData(reader.result as string);
        setData(loadMonth(year, month));
        toast.success("Data imported!");
      } catch {
        toast.error("Invalid JSON file");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const totals = calcTotals(data);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          💰 <span className="text-primary">BudgetBuddy</span>
        </h1>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg bg-secondary hover:bg-muted transition-colors">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <span className="text-lg font-semibold text-foreground min-w-[160px] text-center">
            {getMonthName(month)} {year}
          </span>
          <button onClick={() => navigate(1)} className="p-2 rounded-lg bg-secondary hover:bg-muted transition-colors">
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset} className="p-2 rounded-lg bg-secondary hover:bg-destructive/20 transition-colors" title="Reset">
            <RotateCcw className="w-4 h-4 text-foreground" />
          </button>
          <button onClick={handleExport} className="p-2 rounded-lg bg-secondary hover:bg-primary/20 transition-colors" title="Export">
            <Download className="w-4 h-4 text-foreground" />
          </button>
          <button onClick={() => fileRef.current?.click()} className="p-2 rounded-lg bg-secondary hover:bg-primary/20 transition-colors" title="Import">
            <Upload className="w-4 h-4 text-foreground" />
          </button>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
        </div>
      </div>

      {/* Salary Overview */}
      <SalarySection salary={salary} totalSpent={totals.totalActual} onSalaryChange={handleSalaryChange} />

      {/* Summary */}
      <SummaryCards totals={totals} />

      {/* Charts */}
      <BudgetCharts data={data} totals={totals} />

      {/* Budget Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <BudgetTable title="📋 Bills" items={data.bills} onUpdate={(i, f, v) => updateSection("bills", i, f, v)} onAddItem={(c) => addItem("bills", c)} onRemoveItem={(i) => removeItem("bills", i)} />
        <BudgetTable title="🛒 Expenses" items={data.expenses} onUpdate={(i, f, v) => updateSection("expenses", i, f, v)} onAddItem={(c) => addItem("expenses", c)} onRemoveItem={(i) => removeItem("expenses", i)} />
        <BudgetTable title="🏦 Savings" items={data.savings} onUpdate={(i, f, v) => updateSection("savings", i, f, v)} onAddItem={(c) => addItem("savings", c)} onRemoveItem={(i) => removeItem("savings", i)} />
        <BudgetTable title="📈 Investments" items={data.investments} onUpdate={(i, f, v) => updateSection("investments", i, f, v)} onAddItem={(c) => addItem("investments", c)} onRemoveItem={(i) => removeItem("investments", i)} />
      </div>

      {/* Savings Goals */}
      <SavingsGoals savings={data.savings} />
    </div>
  );
};

export default Index;
