import { supabase } from "@/integrations/supabase/client";

export interface BudgetItem {
  category: string;
  planned: number;
  actual: number;
}

export interface BudgetSection {
  title: string;
  items: BudgetItem[];
}

export interface MonthData {
  bills: BudgetItem[];
  expenses: BudgetItem[];
  savings: BudgetItem[];
  investments: BudgetItem[];
  totalBudget?: number;
}

export const DEFAULT_BILLS: BudgetItem[] = [
  { category: "Rent/EMI", planned: 0, actual: 0 },
  { category: "Electricity", planned: 0, actual: 0 },
  { category: "Internet", planned: 0, actual: 0 },
  { category: "Mobile", planned: 0, actual: 0 },
  { category: "Insurance", planned: 0, actual: 0 },
  { category: "Vehicle EMI", planned: 0, actual: 0 },
];

export const DEFAULT_EXPENSES: BudgetItem[] = [
  { category: "Groceries", planned: 0, actual: 0 },
  { category: "Zomato/Dining", planned: 0, actual: 0 },
  { category: "Petrol", planned: 0, actual: 0 },
  { category: "Shopping", planned: 0, actual: 0 },
  { category: "OTT Subscriptions", planned: 0, actual: 0 },
  { category: "Gym", planned: 0, actual: 0 },
  { category: "Travel", planned: 0, actual: 0 },
];

export const DEFAULT_SAVINGS: BudgetItem[] = [
  { category: "Emergency Fund", planned: 0, actual: 0 },
  { category: "Travel Fund", planned: 0, actual: 0 },
];

export const DEFAULT_INVESTMENTS: BudgetItem[] = [
  { category: "SIP", planned: 0, actual: 0 },
  { category: "FD", planned: 0, actual: 0 },
  { category: "PPF/NPS", planned: 0, actual: 0 },
  { category: "Stocks", planned: 0, actual: 0 },
  { category: "Gold/SGB", planned: 0, actual: 0 },
];

export function getDefaultData(): MonthData {
  return {
    bills: DEFAULT_BILLS.map((i) => ({ ...i })),
    expenses: DEFAULT_EXPENSES.map((i) => ({ ...i })),
    savings: DEFAULT_SAVINGS.map((i) => ({ ...i })),
    investments: DEFAULT_INVESTMENTS.map((i) => ({ ...i })),
  };
}

export async function loadMonth(year: number, month: number): Promise<MonthData> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return getDefaultData();

  const { data, error } = await supabase
    .from("budget_data")
    .select("data")
    .eq("user_id", user.id)
    .eq("year", year)
    .eq("month", month)
    .maybeSingle();

  if (error || !data) return getDefaultData();
  return data.data as unknown as MonthData;
}

export async function saveMonth(year: number, month: number, monthData: MonthData) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("budget_data")
    .upsert(
      { user_id: user.id, year, month, data: monthData as any },
      { onConflict: "user_id,year,month" }
    );
}

export async function resetMonth(year: number, month: number): Promise<MonthData> {
  const current = await loadMonth(year, month);
  const zeroOut = (items: BudgetItem[]) => items.map(i => ({ ...i, planned: 0, actual: 0 }));
  const zeroed: MonthData = {
    bills: zeroOut(current.bills),
    expenses: zeroOut(current.expenses),
    savings: zeroOut(current.savings),
    investments: zeroOut(current.investments),
  };
  await saveMonth(year, month, zeroed);
  return zeroed;
}

export async function exportAllData(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "{}";

  const { data } = await supabase
    .from("budget_data")
    .select("year, month, data")
    .eq("user_id", user.id);

  const result: Record<string, any> = {};
  for (const row of data || []) {
    result[`budget_${row.year}_${row.month}`] = row.data;
  }
  return JSON.stringify(result, null, 2);
}

export async function importData(json: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const parsed = JSON.parse(json) as Record<string, MonthData>;
  for (const [key, value] of Object.entries(parsed)) {
    const match = key.match(/^budget_(\d+)_(\d+)$/);
    if (match) {
      const year = parseInt(match[1]);
      const month = parseInt(match[2]);
      await supabase
        .from("budget_data")
        .upsert(
          { user_id: user.id, year, month, data: value as any },
          { onConflict: "user_id,year,month" }
        );
    }
  }
}

export function getMonthName(month: number): string {
  return new Date(2000, month).toLocaleString("en-IN", { month: "long" });
}

export function calcTotals(data: MonthData) {
  const all = [...data.bills, ...data.expenses, ...data.savings, ...data.investments];
  const plannedSum = all.reduce((s, i) => s + i.planned, 0);
  const totalActual = all.reduce((s, i) => s + i.actual, 0);
  const totalPlanned = data.totalBudget && data.totalBudget > 0 ? data.totalBudget : plannedSum;
  return { totalPlanned, totalActual, remaining: totalPlanned - totalActual };
}

export async function loadSalary(year: number, month: number): Promise<number> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { data, error } = await supabase
    .from("salaries")
    .select("amount")
    .eq("user_id", user.id)
    .eq("year", year)
    .eq("month", month)
    .maybeSingle();

  if (error || !data) return 0;
  return Number(data.amount);
}

export async function saveSalary(year: number, month: number, amount: number) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("salaries")
    .upsert(
      { user_id: user.id, year, month, amount },
      { onConflict: "user_id,year,month" }
    );
}
