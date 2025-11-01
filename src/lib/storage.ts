import { Budget } from "@/types/budget";

const STORAGE_KEY = "arazzo_budgets";

// 🔹 Salvar orçamento (cria ou atualiza)
export const saveBudget = (budget: Budget): void => {
  const budgets = getBudgets();
  const existingIndex = budgets.findIndex((b) => b.id === budget.id);

  if (existingIndex >= 0) {
    budgets[existingIndex] = budget;
  } else {
    budgets.push(budget);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
};

// 🔹 Buscar todos os orçamentos
export const getBudgets = (): Budget[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// 🔹 Buscar orçamento por ID
export const getBudgetById = (id: string): Budget | null => {
  const budgets = getBudgets();
  return budgets.find((b) => b.id === id) || null;
};

// 🔹 Excluir orçamento
export const deleteBudget = (id: string): void => {
  const budgets = getBudgets();
  const filtered = budgets.filter((b) => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

// ✅ Novo cálculo total (usando serviços + convidados + desconto)
export const calculateBudgetTotal = (
  guestCount: number,
  services: { selected: boolean; value?: number }[],
  discount: number
): number => {
  const subtotal = services
    .filter((s) => s.selected)
    .reduce((acc, s) => acc + (Number(s.value || 0) * (guestCount || 0)), 0);

  const discountAmount = (subtotal * discount) / 100;
  return subtotal - discountAmount;
};
