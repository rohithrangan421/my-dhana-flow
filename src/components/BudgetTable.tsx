import type { BudgetItem } from "@/lib/budgetData";
import { useState } from "react";
import { Plus, X } from "lucide-react";

interface Props {
  title: string;
  colorClass?: string;
  items: BudgetItem[];
  onUpdate: (index: number, field: "planned" | "actual", value: number) => void;
  onAddItem?: (category: string) => void;
  onRemoveItem?: (index: number) => void;
}

function getColor(planned: number, actual: number) {
  if (planned === 0) return "text-muted-foreground";
  const pct = (actual / planned) * 100;
  if (pct <= 75) return "text-success";
  if (pct <= 100) return "text-warning";
  return "text-destructive";
}

const BudgetTable = ({ title, colorClass = "", items, onUpdate, onAddItem, onRemoveItem }: Props) => {
  const [editingCell, setEditingCell] = useState<{ idx: number; field: "planned" | "actual" } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [adding, setAdding] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const startEdit = (idx: number, field: "planned" | "actual", current: number) => {
    setEditingCell({ idx, field });
    setEditValue(String(current));
  };

  const commitEdit = () => {
    if (editingCell) {
      const num = Math.max(0, Number(editValue) || 0);
      onUpdate(editingCell.idx, editingCell.field, num);
      setEditingCell(null);
    }
  };

  const totalPlanned = items.reduce((s, i) => s + i.planned, 0);
  const totalActual = items.reduce((s, i) => s + i.actual, 0);

  return (
    <div className={`bg-gradient-to-br ${colorClass || "from-card to-card"} rounded-2xl p-4 md:p-6 shadow-xl border animate-fade-in`}>
      <h3 className="text-lg font-bold text-foreground mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/70 text-muted-foreground">
              <th className="text-left py-2.5 font-semibold text-xs uppercase tracking-wider">Category</th>
              <th className="text-right py-2.5 font-semibold text-xs uppercase tracking-wider">Planned</th>
              <th className="text-right py-2.5 font-semibold text-xs uppercase tracking-wider">Actual</th>
              <th className="text-right py-2.5 font-semibold text-xs uppercase tracking-wider">%</th>
              {onRemoveItem && <th className="w-8"></th>}
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const pct = item.planned > 0 ? Math.round((item.actual / item.planned) * 100) : 0;
              const color = getColor(item.planned, item.actual);
              return (
                <tr key={item.category} className="border-b border-border/30 hover:bg-secondary/40 transition-colors">
                  <td className="py-3 text-foreground font-medium">{item.category}</td>
                  <td className="py-3 text-right">
                    {editingCell?.idx === idx && editingCell.field === "planned" ? (
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={commitEdit}
                        onKeyDown={(e) => e.key === "Enter" && commitEdit()}
                        className="w-20 bg-muted text-foreground text-right rounded-lg px-2 py-1 border border-primary/50 outline-none focus:ring-2 focus:ring-primary/30"
                        autoFocus
                      />
                    ) : (
                      <span
                        className="cursor-pointer text-muted-foreground hover:text-primary transition-colors"
                        onClick={() => startEdit(idx, "planned", item.planned)}
                      >
                        ₹{item.planned.toLocaleString("en-IN")}
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    {editingCell?.idx === idx && editingCell.field === "actual" ? (
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={commitEdit}
                        onKeyDown={(e) => e.key === "Enter" && commitEdit()}
                        className="w-20 bg-muted text-foreground text-right rounded-lg px-2 py-1 border border-primary/50 outline-none focus:ring-2 focus:ring-primary/30"
                        autoFocus
                      />
                    ) : (
                      <span
                        className="cursor-pointer font-semibold hover:text-primary transition-colors text-foreground"
                        onClick={() => startEdit(idx, "actual", item.actual)}
                      >
                        ₹{item.actual.toLocaleString("en-IN")}
                      </span>
                    )}
                  </td>
                  <td className={`py-3 text-right font-bold ${color}`}>{pct}%</td>
                  {onRemoveItem && (
                    <td className="py-3 text-center">
                      <button onClick={() => onRemoveItem(idx)} className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded-lg hover:bg-destructive/10">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="font-bold text-foreground">
              <td className="py-3">Total</td>
              <td className="py-3 text-right text-muted-foreground">₹{totalPlanned.toLocaleString("en-IN")}</td>
              <td className="py-3 text-right">₹{totalActual.toLocaleString("en-IN")}</td>
              <td className={`py-3 text-right ${getColor(totalPlanned, totalActual)}`}>
                {totalPlanned > 0 ? Math.round((totalActual / totalPlanned) * 100) : 0}%
              </td>
              {onRemoveItem && <td></td>}
            </tr>
          </tfoot>
        </table>
      </div>
      {onAddItem && (
        <div className="mt-4">
          {adding ? (
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newCategory.trim()) {
                    onAddItem(newCategory.trim());
                    setNewCategory("");
                    setAdding(false);
                  }
                  if (e.key === "Escape") setAdding(false);
                }}
                className="flex-1 bg-muted text-foreground rounded-lg px-3 py-2 border border-border text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                autoFocus
              />
              <button
                onClick={() => {
                  if (newCategory.trim()) {
                    onAddItem(newCategory.trim());
                    setNewCategory("");
                    setAdding(false);
                  }
                }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Add
              </button>
              <button onClick={() => setAdding(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Category
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BudgetTable;
