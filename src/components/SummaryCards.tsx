interface Props {
  totals: { totalPlanned: number; totalActual: number; remaining: number };
}

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const SummaryCards = ({ totals }: Props) => {
  const { totalPlanned, totalActual, remaining } = totals;
  const pct = totalPlanned > 0 ? Math.round((totalActual / totalPlanned) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div className="bg-gradient-to-br from-primary/15 to-card rounded-2xl p-5 shadow-xl border border-primary/20 animate-fade-in">
        <p className="text-muted-foreground text-sm font-medium mb-1">Total Budget</p>
        <p className="text-2xl font-bold text-foreground">{fmt(totalPlanned)}</p>
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
