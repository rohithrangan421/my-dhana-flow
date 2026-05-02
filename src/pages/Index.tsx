import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import {
  type MonthData,
  loadMonth,
  saveMonth,
  resetMonth,
  importData,
  getMonthName,
  calcTotals,
  getDefaultData,
  loadSalary,
  saveSalary,
} from "@/lib/budgetData";
import BudgetTable from "@/components/BudgetTable";
import SummaryCards from "@/components/SummaryCards";
import BudgetCharts from "@/components/BudgetCharts";
import SavingsGoals from "@/components/SavingsGoals";
import SalarySection from "@/components/SalarySection";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronLeft, ChevronRight, RotateCcw, Download, Upload, LogOut, Loader2, Check } from "lucide-react";
import * as XLSX from "xlsx";

const Index = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [data, setData] = useState<MonthData>(getDefaultData());
  const [salary, setSalary] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { user, signOut } = useAuth();

  const yearRef = useRef(year);
  const monthRef = useRef(month);
  const pendingSave = useRef<Promise<void> | null>(null);

  useEffect(() => {
    yearRef.current = year;
    monthRef.current = month;
  }, [year, month]);

  const fetchData = useCallback(async (y: number, m: number) => {
    // Wait for any pending save to complete before loading
    if (pendingSave.current) {
      await pendingSave.current;
      pendingSave.current = null;
    }
    setLoading(true);
    const [monthData, sal] = await Promise.all([loadMonth(y, m), loadSalary(y, m)]);
    setData(monthData);
    setSalary(sal);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData(year, month);
  }, [year, month, fetchData]);

  const persist = useCallback(
    async (newData: MonthData) => {
      setData(newData);
      const y = yearRef.current;
      const m = monthRef.current;
      setSaveStatus("saving");
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      const savePromise = saveMonth(y, m, newData)
        .then(() => {
          setSaveStatus("saved");
          savedTimerRef.current = setTimeout(() => setSaveStatus("idle"), 1500);
        })
        .catch((err) => {
          console.error("Failed to save budget data:", err);
          toast.error("Failed to save data");
          setSaveStatus("idle");
        });
      pendingSave.current = savePromise;
      await savePromise;
    },
    []
  );

  const navigate = (dir: -1 | 1) => {
    let m = month + dir;
    let y = year;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setMonth(m);
    setYear(y);
  };

  const handleSalaryChange = async (val: number) => {
    setSalary(val);
    setSaveStatus("saving");
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    try {
      await saveSalary(year, month, val);
      setSaveStatus("saved");
      savedTimerRef.current = setTimeout(() => setSaveStatus("idle"), 1500);
      toast.success("Salary updated!", { duration: 1500 });
    } catch {
      setSaveStatus("idle");
      toast.error("Failed to save salary");
    }
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

  const handleReset = async () => {
    const zeroed = await resetMonth(year, month);
    setData(zeroed);
    setSalary(0);
    await saveSalary(year, month, 0);
    toast.info("All amounts reset to zero");
  };

  const handleExport = () => {
    const wb = XLSX.utils.book_new();
    const sections: { name: string; items: typeof data.bills }[] = [
      { name: "Bills", items: data.bills },
      { name: "Expenses", items: data.expenses },
      { name: "Savings", items: data.savings },
      { name: "Investments", items: data.investments },
    ];

    const summaryRows = [
      ["BudgetBuddy - " + getMonthName(month) + " " + year],
      [],
      ["Salary", salary],
      ["Total Planned", totals.totalPlanned],
      ["Total Actual", totals.totalActual],
      ["Remaining", totals.remaining],
    ];
    const summaryWs = XLSX.utils.aoa_to_sheet(summaryRows);
    XLSX.utils.book_append_sheet(wb, summaryWs, "Summary");

    for (const sec of sections) {
      const rows = [["Category", "Planned (₹)", "Actual (₹)", "Difference (₹)"]];
      let totalP = 0, totalA = 0;
      for (const item of sec.items) {
        rows.push([item.category, item.planned as any, item.actual as any, (item.planned - item.actual) as any]);
        totalP += item.planned;
        totalA += item.actual;
      }
      rows.push(["Total", totalP as any, totalA as any, (totalP - totalA) as any]);
      const ws = XLSX.utils.aoa_to_sheet(rows);
      ws["!cols"] = [{ wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, ws, sec.name);
    }

    XLSX.writeFile(wb, `BudgetBuddy_${getMonthName(month)}_${year}.xlsx`);
    toast.success("Exported to Excel!");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        await importData(reader.result as string);
        await fetchData(year, month);
        toast.success("Data imported!");
      } catch {
        toast.error("Invalid JSON file");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const totals = calcTotals(data);

  const sectionColors = {
    bills: "from-primary/20 to-primary/5 border-primary/30",
    expenses: "from-accent/20 to-accent/5 border-accent/30",
    savings: "from-success/20 to-success/5 border-success/30",
    investments: "from-warning/20 to-warning/5 border-warning/30",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-lg animate-pulse">Loading your budget...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
          💰 <span className="bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent">BudgetBuddy</span>
        </h1>
        <div className="flex items-center gap-1.5">
          <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-secondary hover:bg-primary/20 hover:text-primary transition-all duration-200">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg font-bold text-foreground min-w-[170px] text-center px-3 py-1.5 rounded-xl bg-secondary/50">
            {getMonthName(month)} {year}
          </span>
          <button onClick={() => navigate(1)} className="p-2.5 rounded-xl bg-secondary hover:bg-primary/20 hover:text-primary transition-all duration-200">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset} className="p-2.5 rounded-xl bg-secondary hover:bg-destructive/20 hover:text-destructive transition-all duration-200" title="Reset">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button onClick={handleExport} className="p-2.5 rounded-xl bg-secondary hover:bg-primary/20 hover:text-primary transition-all duration-200" title="Export">
            <Download className="w-4 h-4" />
          </button>
          <button onClick={() => fileRef.current?.click()} className="p-2.5 rounded-xl bg-secondary hover:bg-accent/20 hover:text-accent transition-all duration-200" title="Import">
            <Upload className="w-4 h-4" />
          </button>
          <button onClick={signOut} className="p-2.5 rounded-xl bg-secondary hover:bg-destructive/20 hover:text-destructive transition-all duration-200" title="Sign Out">
            <LogOut className="w-4 h-4" />
          </button>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <div className="h-6 flex items-center">
          {saveStatus === "saving" && (
            <div className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary animate-fade-in">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Saving...
            </div>
          )}
          {saveStatus === "saved" && (
            <div className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-success/10 text-success animate-fade-in">
              <Check className="w-3.5 h-3.5" />
              Saved
            </div>
          )}
        </div>
        {user && (
          <div className="text-sm text-muted-foreground ml-auto">
            Signed in as <span className="text-foreground font-medium">{user.email}</span>
          </div>
        )}
      </div>

      <SalarySection salary={salary} totalSpent={totals.totalActual} onSalaryChange={handleSalaryChange} />
      <SummaryCards totals={totals} />
      <BudgetCharts data={data} totals={totals} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <BudgetTable title="📋 Bills" colorClass={sectionColors.bills} items={data.bills} onUpdate={(i, f, v) => updateSection("bills", i, f, v)} onAddItem={(c) => addItem("bills", c)} onRemoveItem={(i) => removeItem("bills", i)} />
        <BudgetTable title="🛒 Expenses" colorClass={sectionColors.expenses} items={data.expenses} onUpdate={(i, f, v) => updateSection("expenses", i, f, v)} onAddItem={(c) => addItem("expenses", c)} onRemoveItem={(i) => removeItem("expenses", i)} />
        <BudgetTable title="🏦 Savings" colorClass={sectionColors.savings} items={data.savings} onUpdate={(i, f, v) => updateSection("savings", i, f, v)} onAddItem={(c) => addItem("savings", c)} onRemoveItem={(i) => removeItem("savings", i)} />
        <BudgetTable title="📈 Investments" colorClass={sectionColors.investments} items={data.investments} onUpdate={(i, f, v) => updateSection("investments", i, f, v)} onAddItem={(c) => addItem("investments", c)} onRemoveItem={(i) => removeItem("investments", i)} />
      </div>

      <SavingsGoals savings={data.savings} />
    </div>
  );
};

export default Index;
