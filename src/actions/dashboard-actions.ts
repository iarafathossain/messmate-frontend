"use server";

import { handleResponse } from "@/utils/handle-response";
import { serverFetch } from "@/utils/server-fetch";

export async function getMonthlySheet(year: number, month: number) {
  const response = await serverFetch.get(
    `/dashboard/monthly-sheet?year=${year}&month=${month}`,
    { cache: "no-store" },
  );
  return handleResponse<MonthlySheet>(response, "Could not load monthly sheet");
}

export async function getMealSheet() {
  const response = await serverFetch.get("/dashboard/meal-sheet", { cache: "no-store" });
  return handleResponse<MonthlySheet>(response, "Could not load meal sheet");
}

export async function saveMealRecord(payload: {
  messMemberId: string;
  mealRecordId?: string;
  mealType: "FULL" | "HALF";
  mealDate: string;
  mealRate?: number;
}) {
  const response = await serverFetch.post(
    "/meal-record/upsert-single-meal-record",
    {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  return handleResponse(response, "Could not save meal record");
}

export async function saveDeposit(payload: {
  messMemberId: string;
  amount: number;
  depositDate: string;
  note?: string;
}) {
  const response = await serverFetch.post("/deposit/upsert", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(response, "Could not save deposit");
}

export async function saveMealRate(payload: { fullMealRate?: number; halfMealRate?: number }) {
  const response = await serverFetch.post("/meal-rate/upsert", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(response, "Could not save meal rate");
}

export async function saveExpense(payload: {
  messId: string;
  expenseId?: string;
  description: string;
  amount: number;
}) {
  const response = await serverFetch.post("/expense/upsert", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(response, "Could not save expense");
}

export async function getExpenses() {
  const response = await serverFetch.get("/expense", { cache: "no-store" });
  return handleResponse<ExpenseRecord[]>(response, "Could not load expenses");
}

export interface ExpenseRecord {
  id: string;
  description: string;
  amount: string | number;
  createdAt: string;
}

export interface MonthlySheet {
  mess: { id: string; name: string; code: string };
  year?: number;
  month?: number;
  mealRate: {
    fullMealRate: string | number | null;
    halfMealRate: string | number | null;
  } | null;
  members: Array<{
    id: string;
    user: { name: string; phone: string };
    deposits: Array<{ amount: string | number }>;
    mealRecords: Array<{
      id: string;
      mealType: "FULL" | "HALF";
      mealRate: string | number;
      mealDate: string;
    }>;
  }>;
  expenses: Array<{ id: string; description: string; amount: string | number }>;
  totals: { revenue: number; expenses: number };
}
