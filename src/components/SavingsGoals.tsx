import type { BudgetItem } from "@/lib/budgetData";

interface Props {
  savings: BudgetItem[];
}

const SavingsGoals = ({ savings }: Props) => {
  return (
    <div className="bg-card rounded-xl p-4 md:p-6 shadow-lg border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">🎯 Savings Goals</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {savings.map((item) => {
          const pct = item.planned > 0 ? Math.min(100, Math.round((item.actual / item.planned) * 100)) : 0;
          const color = pct >= 100 ? "bg-success" : pct >= 50 ? "bg-primary" : "bg-warning";
          return (
            <div key={item.category} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-foreground">{item.category}</span>
                <span className="text-muted-foreground">
                  ₹{item.actual.toLocaleString("en-IN")} / ₹{item.planned.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${color} transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-right">{pct}% complete</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavingsGoals;
