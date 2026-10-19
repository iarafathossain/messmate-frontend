"use client";

import {
  getMealSheet,
  saveMealRecord,
  type MonthlySheet,
} from "@/actions/dashboard-actions";
import { DatePicker } from "@/components/shared/date-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserRole } from "@/interfaces/user-type";
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";

const numberValue = (value: string | number | null | undefined) =>
  Number(value ?? 0);

export function MonthlyMealSheet({ role }: { role: UserRole }) {
  const editable = role === UserRole.MESS;
  const [sheet, setSheet] = useState<MonthlySheet | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  async function refresh() {
    const result = await getMealSheet();
    if (result.success && result.data) setSheet(result.data);
    else setError(result.message || "Could not load meal sheet");
  }

  useEffect(() => {
    let cancelled = false;

    void getMealSheet()
      .then((result) => {
        if (cancelled) return;
        if (result.success && result.data) setSheet(result.data);
        else setError(result.message || "Could not load meal sheet");
      })
      .catch(() => {
        if (!cancelled) setError("Could not load meal sheet");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function saveRow(
    member: MonthlySheet["members"][number],
    values: {
      date: Date;
      type: "FULL" | "HALF";
      amount: number;
    },
  ) {
    const record = member.mealRecords[0];
    setSaving(member.id);
    const mealResult = await saveMealRecord({
      messMemberId: member.id,
      mealRecordId: record?.id,
      mealType: values.type,
      mealDate: format(values.date, "yyyy-MM-dd"),
      mealRate: values.amount,
    });
    if (!mealResult.success) {
      setError(mealResult.message || "Could not save meal record");
      setSaving(null);
      return;
    }
    await refresh();
    window.dispatchEvent(new CustomEvent("messmate:totals-refresh"));
    setSaving(null);
  }

  if (error)
    return (
      <Card>
        <CardContent className="pt-6 text-destructive">{error}</CardContent>
      </Card>
    );
  if (!sheet)
    return (
      <Card>
        <CardContent className="pt-6">Loading meal sheet...</CardContent>
      </Card>
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meal sheet</CardTitle>
      </CardHeader>
      <CardContent>
        {sheet.members.length === 0 ? (
          <p className="text-muted-foreground">
            No members have joined this mess yet.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Meal type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Balance</TableHead>
                {editable && <TableHead />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sheet.members.map((member) => {
                const record = member.mealRecords[0];
                const initialDate = record?.mealDate
                  ? parseISO(record.mealDate.slice(0, 10))
                  : undefined;
                const initialType = record?.mealType ?? "FULL";
                const initialAmount = numberValue(
                  record?.mealRate ??
                    (initialType === "FULL"
                      ? sheet.mealRate?.fullMealRate
                      : sheet.mealRate?.halfMealRate),
                );
                const totalDeposit = member.deposits.reduce(
                  (sum, deposit) => sum + numberValue(deposit.amount),
                  0,
                );
                return (
                  <MealSheetRow
                    key={member.id}
                    member={member}
                    editable={editable}
                    saving={saving === member.id}
                    initialDate={initialDate}
                    initialType={initialType}
                    initialAmount={initialAmount}
                    totalDeposit={totalDeposit}
                    rates={sheet.mealRate}
                    onSave={saveRow}
                  />
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function MealSheetRow({
  member,
  editable,
  saving,
  initialDate,
  initialType,
  initialAmount,
  totalDeposit,
  rates,
  onSave,
}: {
  member: MonthlySheet["members"][number];
  editable: boolean;
  saving: boolean;
  initialDate?: Date;
  initialType: "FULL" | "HALF";
  initialAmount: number;
  totalDeposit: number;
  rates: MonthlySheet["mealRate"];
  onSave: (
    member: MonthlySheet["members"][number],
    values: {
      date: Date;
      type: "FULL" | "HALF";
      amount: number;
    },
  ) => Promise<void>;
}) {
  const [date, setDate] = useState<Date | undefined>(initialDate);
  const [type, setType] = useState<"FULL" | "HALF">(initialType);
  const selectedRate =
    type === "FULL" ? rates?.fullMealRate : rates?.halfMealRate;
  const amount = numberValue(
    type === initialType ? initialAmount : selectedRate ?? initialAmount,
  );
  const balance = totalDeposit - amount;

  function changeType(value: "FULL" | "HALF") {
    setType(value);
  }

  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{member.user.name}</div>
        <div className="text-xs text-muted-foreground">{member.user.phone}</div>
      </TableCell>
      <TableCell>
        {editable ? (
          <DatePicker date={date} onDateChange={setDate} disabled={saving} />
        ) : date ? (
          format(date, "PPP")
        ) : (
          "Not set"
        )}
      </TableCell>
      <TableCell>
        {editable ? (
          <Select
            value={type}
            disabled={saving}
            onValueChange={(value) => changeType(value as "FULL" | "HALF")}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FULL">Full</SelectItem>
              <SelectItem value="HALF">Half</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          type
        )}
      </TableCell>
      <TableCell>
        {amount.toFixed(2)}
      </TableCell>
      <TableCell>
        {numberValue(balance).toFixed(2)}
      </TableCell>
      {editable && (
        <TableCell>
          <Button
            size="sm"
            disabled={
              saving || !date
            }
            onClick={() =>
              date &&
              onSave(member, {
                date,
                type,
                amount,
              })
            }
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </TableCell>
      )}
    </TableRow>
  );
}
