"use client";

import { getExpenses, type ExpenseRecord } from "@/actions/dashboard-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";

const amount = (value: string | number) => Number(value).toFixed(2);

export function ExpensesTable() {
  const [expenses, setExpenses] = useState<ExpenseRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getExpenses()
      .then((result) => {
        if (result.success && result.data) setExpenses(result.data);
        else setError(result.message || "Could not load expenses");
      })
      .catch(() => setError("Could not load expenses"));
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : expenses === null ? (
          <p className="text-sm text-muted-foreground">Loading expenses...</p>
        ) : expenses.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No expense records found.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>
                    {format(parseISO(expense.createdAt), "PPP")}
                  </TableCell>
                  <TableCell className="font-medium">
                    {amount(expense.amount)}
                  </TableCell>
                  <TableCell className="max-w-xl whitespace-normal">
                    {expense.description}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
