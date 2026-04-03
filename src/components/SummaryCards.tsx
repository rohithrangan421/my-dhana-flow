interface Props {
  totals: { totalPlanned: number; totalActual: number; remaining: number };
}

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const SummaryCards = ({ totals }: Props) => {
  const { totalPlanned, totalActual, remaining } = totals;
  const pct = totalPlanned > 0 ? Math.round((totalActual / totalPlanned) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div className="bg-card rounded-xl p-5 shadow-lg border border-border">
        <p className="text-muted-foreground text-sm mb-1">Total Budget</p>
        <p className="text-2xl font-bold text-foreground">{fmt(totalPlanned)}</p>
      </div>
      <div className="bg-card rounded-xl p-5 shadow-lg border border-border">
        <p className="text-muted-foreground text-sm mb-1">Total Spent</p>
        <p className="text-2xl font-bold text-primary">{fmt(totalActual)}</p>
        <div className="mt-2 w-full bg-muted rounded-full h-2">
          <div
            className="h-2 rounded-full bg-primary transition-all duration-500"
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
      </div>
      <div className="bg-card rounded-xl p-5 shadow-lg border border-border">
        <p className="text-muted-foreground text-sm mb-1">Amount Left</p>
        <p className={`text-2xl font-bold ${remaining >= 0 ? "text-success" : "text-destructive"}`}>
          {fmt(Math.abs(remaining))}
          {remaining < 0 && <span className="text-sm ml-1">over</span>}
        </p>
      </div>
    </div>
  );
};

export default SummaryCards;
