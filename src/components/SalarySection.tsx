import { useState } from "react";

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
    <div className="bg-card rounded-xl p-5 shadow-lg border border-border mb-8">
      <h3 className="text-lg font-semibold text-foreground mb-4">💼 Salary Overview</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <p className="text-muted-foreground text-sm mb-1">Monthly Salary</p>
          {editing ? (
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => e.key === "Enter" && commit()}
              className="w-full bg-muted text-foreground text-xl font-bold rounded px-3 py-1 border border-primary/50 outline-none"
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
        <div>
          <p className="text-muted-foreground text-sm mb-1">Total Spent</p>
          <p className="text-2xl font-bold text-foreground">{fmt(totalSpent)}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-sm mb-1">Net Remaining</p>
          <p className={`text-2xl font-bold ${remaining >= 0 ? "text-success" : "text-destructive"}`}>
            {remaining >= 0 ? fmt(remaining) : `-${fmt(Math.abs(remaining))}`}
          </p>
        </div>
      </div>
      {salary > 0 && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-1">
            <span>Spending</span>
            <span>{pct}% of salary</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${pct > 100 ? "bg-destructive" : pct > 80 ? "bg-warning" : "bg-primary"}`}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SalarySection;
