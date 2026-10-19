"use client";

import { getMonthlySheet, saveExpense } from "@/actions/dashboard-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export function AddExpenseForm() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const current = new Date();
      const sheet = await getMonthlySheet(
        current.getFullYear(),
        current.getMonth() + 1,
      );
      if (!sheet.success || !sheet.data) {
        setError(sheet.message || "Could not identify mess");
        return;
      }

      const result = await saveExpense({
        messId: sheet.data.mess.id,
        description: description.trim(),
        amount: Number(amount),
      });
      if (!result.success) {
        setError(result.message || "Could not save expense");
        return;
      }

      setDescription("");
      setAmount("");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Could not save expense",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add daily expense</CardTitle>
        <CardDescription>
          Record an expense for your mess. Add as much detail as needed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="expense-description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="expense-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe what the expense was for..."
              rows={6}
              className="min-h-32 resize-y"
              maxLength={1000}
              required
            />
          </div>
          <div className="grid max-w-xs gap-2">
            <label htmlFor="expense-amount" className="text-sm font-medium">
              Amount
            </label>
            <Input
              id="expense-amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              required
            />
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <div>
            <Button type="submit" disabled={saving || !description.trim() || Number(amount) <= 0}>
              {saving ? "Saving..." : "Save expense"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
