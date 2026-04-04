import { useState } from "react";
import { Wallet, TrendingDown, PiggyBank } from "lucide-react";

interface Props {
  salary: number;
  totalSpent: number;
  onSalaryChange: (val: number) => void;
}

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const SalarySection = ({ salary, totalSpent, onSalaryChange }: Props) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(salary));
  const remaining = salary - totalSpent;
  const pct = salary > 0 ? Math.round((totalSpent / salary) * 100) : 0;

  const commit = () => {
    const num = Math.max(0, Number(value) || 0);
    onSalaryChange(num);
    setEditing(false);
  };

  return (
    <div className="bg-gradient-to-r from-primary/10 via-card to-accent/10 rounded-2xl p-6 shadow-xl border border-primary/20 mb-8 animate-fade-in">
      <h3 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
        <Wallet className="w-5 h-5 text-primary" /> Salary Overview
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-secondary/50 rounded-xl p-4">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">Monthly Salary</p>
          {editing ? (
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => e.key === "Enter" && commit()}
              className="w-full bg-muted text-foreground text-xl font-bold rounded-lg px-3 py-1.5 border border-primary/50 outline-none focus:ring-2 focus:ring-primary/30"
              autoFocus
            />
          ) : (
            <p
              className="text-2xl font-bold text-primary cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => { setValue(String(salary)); setEditing(true); }}
            >
              {salary > 0 ? fmt(salary) : "Click to set"}
            </p>
          )}
        </div>
        <div className="bg-secondary/50 rounded-xl p-4">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" /> Total Spent
          </p>
          <p className="text-2xl font-bold text-accent">{fmt(totalSpent)}</p>
        </div>
        <div className="bg-secondary/50 rounded-xl p-4">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
            <PiggyBank className="w-3.5 h-3.5" /> Net Remaining
          </p>
          <p className={`text-2xl font-bold ${remaining >= 0 ? "text-success" : "text-destructive"}`}>
            {remaining >= 0 ? fmt(remaining) : `-${fmt(Math.abs(remaining))}`}
          </p>
        </div>
      </div>
      {salary > 0 && (
        <div className="mt-5">
          <div className="flex justify-between text-sm text-muted-foreground mb-1.5 font-medium">
            <span>Spending Utilization</span>
            <span className={pct > 100 ? "text-destructive" : pct > 80 ? "text-warning" : "text-success"}>{pct}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3.5 overflow-hidden">
            <div
              className={`h-3.5 rounded-full transition-all duration-700 ${
                pct > 100
                  ? "bg-gradient-to-r from-destructive to-destructive/70"
                  : pct > 80
                  ? "bg-gradient-to-r from-warning to-warning/70"
                  : "bg-gradient-to-r from-success to-accent"
              }`}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SalarySection;
