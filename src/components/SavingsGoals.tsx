import type { BudgetItem } from "@/lib/budgetData";
import { Target } from "lucide-react";

interface Props {
  savings: BudgetItem[];
}

const SavingsGoals = ({ savings }: Props) => {
  return (
    <div className="bg-gradient-to-br from-success/10 to-card rounded-2xl p-4 md:p-6 shadow-xl border border-success/20 animate-fade-in">
      <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-success" /> Savings Goals
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {savings.map((item) => {
          const pct = item.planned > 0 ? Math.min(100, Math.round((item.actual / item.planned) * 100)) : 0;
          const gradient = pct >= 100
            ? "from-success to-success/70"
            : pct >= 50
            ? "from-primary to-accent"
            : "from-warning to-warning/70";
          return (
            <div key={item.category} className="bg-secondary/40 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-foreground font-semibold">{item.category}</span>
                <span className="text-muted-foreground font-medium">
                  ₹{item.actual.toLocaleString("en-IN")} / ₹{item.planned.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3.5 overflow-hidden">
                <div
                  className={`h-3.5 rounded-full bg-gradient-to-r ${gradient} transition-all duration-700`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-right font-semibold">{pct}% complete</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavingsGoals;
