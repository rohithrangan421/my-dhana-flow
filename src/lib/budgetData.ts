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
}

export const DEFAULT_BILLS: BudgetItem[] = [
  { category: "Rent/EMI", planned: 15000, actual: 0 },
  { category: "Electricity", planned: 2000, actual: 0 },
  { category: "Internet", planned: 1000, actual: 0 },
  { category: "Mobile", planned: 500, actual: 0 },
  { category: "Insurance", planned: 3000, actual: 0 },
  { category: "Vehicle EMI", planned: 8000, actual: 0 },
];

export const DEFAULT_EXPENSES: BudgetItem[] = [
  { category: "Groceries", planned: 5000, actual: 0 },
  { category: "Zomato/Dining", planned: 3000, actual: 0 },
  { category: "Petrol", planned: 3000, actual: 0 },
  { category: "Shopping", planned: 2000, actual: 0 },
  { category: "OTT Subscriptions", planned: 1000, actual: 0 },
  { category: "Gym", planned: 1500, actual: 0 },
  { category: "Travel", planned: 2000, actual: 0 },
];

export const DEFAULT_SAVINGS: BudgetItem[] = [
  { category: "Emergency Fund", planned: 5000, actual: 0 },
  { category: "Travel Fund", planned: 3000, actual: 0 },
];

export const DEFAULT_INVESTMENTS: BudgetItem[] = [
  { category: "SIP", planned: 5000, actual: 0 },
  { category: "FD", planned: 3000, actual: 0 },
  { category: "PPF/NPS", planned: 2000, actual: 0 },
  { category: "Stocks", planned: 3000, actual: 0 },
  { category: "Gold/SGB", planned: 2000, actual: 0 },
];

function getKey(year: number, month: number) {
  return `budget_${year}_${month}`;
}

export function getDefaultData(): MonthData {
  return {
    bills: DEFAULT_BILLS.map((i) => ({ ...i })),
    expenses: DEFAULT_EXPENSES.map((i) => ({ ...i })),
    savings: DEFAULT_SAVINGS.map((i) => ({ ...i })),
    investments: DEFAULT_INVESTMENTS.map((i) => ({ ...i })),
  };
}

export function loadMonth(year: number, month: number): MonthData {
  const key = getKey(year, month);
  const raw = localStorage.getItem(key);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // fall through
    }
  }
  return getDefaultData();
}

export function saveMonth(year: number, month: number, data: MonthData) {
  localStorage.setItem(getKey(year, month), JSON.stringify(data));
}

export function resetMonth(year: number, month: number) {
  localStorage.removeItem(getKey(year, month));
}

export function exportAllData(): string {
  const allData: Record<string, MonthData> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("budget_")) {
      try {
        allData[key] = JSON.parse(localStorage.getItem(key)!);
      } catch {
        // skip
      }
    }
  }
  return JSON.stringify(allData, null, 2);
}

export function importData(json: string) {
  const data = JSON.parse(json) as Record<string, MonthData>;
  for (const [key, value] of Object.entries(data)) {
    if (key.startsWith("budget_")) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
}

export function getMonthName(month: number): string {
  return new Date(2000, month).toLocaleString("en-IN", { month: "long" });
}

export function calcTotals(data: MonthData) {
  const all = [...data.bills, ...data.expenses, ...data.savings, ...data.investments];
  const totalPlanned = all.reduce((s, i) => s + i.planned, 0);
  const totalActual = all.reduce((s, i) => s + i.actual, 0);
  return { totalPlanned, totalActual, remaining: totalPlanned - totalActual };
}

export function loadSalary(year: number, month: number): number {
  const raw = localStorage.getItem(`salary_${year}_${month}`);
  return raw ? Number(raw) : 0;
}

export function saveSalary(year: number, month: number, amount: number) {
  localStorage.setItem(`salary_${year}_${month}`, String(amount));
}
