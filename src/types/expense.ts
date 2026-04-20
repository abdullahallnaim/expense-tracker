export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  categoryId?: string;
}

export interface DayExpense {
  id: string;
  date: string;
  items: ExpenseItem[];
}

export interface IncomeEntry {
  id: string;
  source: string;
  amount: number;
}

/** Budget for a (month, category) — stored as doc id `${monthKey}_${categoryId}` */
export interface CategoryBudget {
  id: string;
  monthKey: string; // "M-YY" same as MonthlySummary.getMonthKey
  categoryId: string;
  amount: number;
}

/** Aggregated incomes for one month — doc id is monthKey */
export interface MonthIncome {
  monthKey: string;
  entries: IncomeEntry[];
}
