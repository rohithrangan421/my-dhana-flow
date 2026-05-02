import { useState, useEffect } from "react";

interface Props {
  totals: { totalPlanned: number; totalActual: number; remaining: number };
  totalBudget?: number;
  onTotalBudgetChange?: (val: number) => void;
}

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const SummaryCards = ({ totals, totalBudget, onTotalBudgetChange }: Props) => {
  const { totalPlanned, totalActual, remaining } = totals;
  const pct = totalPlanned > 0 ? Math.round((totalActual / totalPlanned) * 100) : 0;
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(totalBudget ?? ""));

  useEffect(() => {
    setValue(String(totalBudget ?? ""));
  }, [totalBudget]);

  const commit = () => {
    const num = Math.max(0, Number(value) || 0);
    onTotalBudgetChange?.(num);
    setEditing(false);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div className="bg-gradient-to-br from-primary/15 to-card rounded-2xl p-5 shadow-xl border border-primary/20 animate-fade-in">
        <p className="text-muted-foreground text-sm font-medium mb-1">Total Budget</p>
        {editing ? (
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => e.key === "Enter" && commit()}
            className="w-full bg-muted text-foreground text-2xl font-bold rounded-lg px-2 py-1 border border-primary/50 outline-none focus:ring-2 focus:ring-primary/30"
            autoFocus
            placeholder="Enter budget"
          />
        ) : (
          <p
            className="text-2xl font-bold text-foreground cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => { setValue(String(totalBudget ?? totalPlanned ?? "")); setEditing(true); }}
            title="Click to edit"
          >
            {totalPlanned > 0 ? fmt(totalPlanned) : "Click to set"}
          </p>
        )}
      </div>
      <div className="bg-gradient-to-br from-accent/15 to-card rounded-2xl p-5 shadow-xl border border-accent/20 animate-fade-in">
        <p className="text-muted-foreground text-sm font-medium mb-1">Total Spent</p>
        <p className="text-2xl font-bold text-accent">{fmt(totalActual)}</p>
        <div className="mt-2.5 w-full bg-muted rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-accent to-primary transition-all duration-500"
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
      </div>
      <div className="bg-gradient-to-br from-success/15 to-card rounded-2xl p-5 shadow-xl border border-success/20 animate-fade-in">
        <p className="text-muted-foreground text-sm font-medium mb-1">Amount Left</p>
        <p className={`text-2xl font-bold ${remaining >= 0 ? "text-success" : "text-destructive"}`}>
          {fmt(Math.abs(remaining))}
          {remaining < 0 && <span className="text-sm ml-1 opacity-80">over</span>}
        </p>
      </div>
    </div>
  );
};

export default SummaryCards;
