"use client";

import { getMonthlySheet } from "@/actions/dashboard-actions";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

export function SectionCards() {
  const [totals, setTotals] = useState({ revenue: 0, expenses: 0 });
  useEffect(() => {
    function loadTotals() {
    const now = new Date();
    getMonthlySheet(now.getFullYear(), now.getMonth() + 1).then((result) => {
      if (result.success && result.data) setTotals(result.data.totals);
    });
    }
    loadTotals();
    window.addEventListener("messmate:totals-refresh", loadTotals);
    return () => window.removeEventListener("messmate:totals-refresh", loadTotals);
  }, []);
  return <div className="grid gap-4 md:grid-cols-2">
    <Card><CardHeader><CardDescription>Total revenue</CardDescription><CardTitle>{totals.revenue.toFixed(2)}</CardTitle></CardHeader></Card>
    <Card><CardHeader><CardDescription>Total expenses</CardDescription><CardTitle>{totals.expenses.toFixed(2)}</CardTitle></CardHeader></Card>
  </div>;
}
