import type { BudgetItem } from "@/lib/budgetData";
import { useState } from "react";
import { Plus, X } from "lucide-react";

interface Props {
  title: string;
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

const BudgetTable = ({ title, items, onUpdate, onAddItem, onRemoveItem }: Props) => {
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
    <div className="bg-card rounded-xl p-4 md:p-6 shadow-lg border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-2 font-medium">Category</th>
              <th className="text-right py-2 font-medium">Planned</th>
              <th className="text-right py-2 font-medium">Actual</th>
              <th className="text-right py-2 font-medium">%</th>
              {onRemoveItem && <th className="w-8"></th>}
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const pct = item.planned > 0 ? Math.round((item.actual / item.planned) * 100) : 0;
              const color = getColor(item.planned, item.actual);
              return (
                <tr key={item.category} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                  <td className="py-2.5 text-foreground">{item.category}</td>
                  <td className="py-2.5 text-right">
                    {editingCell?.idx === idx && editingCell.field === "planned" ? (
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={commitEdit}
                        onKeyDown={(e) => e.key === "Enter" && commitEdit()}
                        className="w-20 bg-muted text-foreground text-right rounded px-2 py-0.5 border border-primary/50 outline-none"
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
                  <td className="py-2.5 text-right">
                    {editingCell?.idx === idx && editingCell.field === "actual" ? (
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={commitEdit}
                        onKeyDown={(e) => e.key === "Enter" && commitEdit()}
                        className="w-20 bg-muted text-foreground text-right rounded px-2 py-0.5 border border-primary/50 outline-none"
                        autoFocus
                      />
                    ) : (
                      <span
                        className="cursor-pointer font-medium hover:text-primary transition-colors text-foreground"
                        onClick={() => startEdit(idx, "actual", item.actual)}
                      >
                        ₹{item.actual.toLocaleString("en-IN")}
                      </span>
                    )}
                  </td>
                  <td className={`py-2.5 text-right font-semibold ${color}`}>{pct}%</td>
                  {onRemoveItem && (
                    <td className="py-2.5 text-center">
                      <button onClick={() => onRemoveItem(idx)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="font-semibold text-foreground">
              <td className="py-2.5">Total</td>
              <td className="py-2.5 text-right text-muted-foreground">₹{totalPlanned.toLocaleString("en-IN")}</td>
              <td className="py-2.5 text-right">₹{totalActual.toLocaleString("en-IN")}</td>
              <td className={`py-2.5 text-right ${getColor(totalPlanned, totalActual)}`}>
                {totalPlanned > 0 ? Math.round((totalActual / totalPlanned) * 100) : 0}%
              </td>
              {onRemoveItem && <td></td>}
            </tr>
          </tfoot>
        </table>
      </div>
      {onAddItem && (
        <div className="mt-3">
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
                className="flex-1 bg-muted text-foreground rounded px-3 py-1.5 border border-border text-sm outline-none focus:border-primary/50"
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
                className="px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm font-medium hover:opacity-90 transition-opacity"
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
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
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
