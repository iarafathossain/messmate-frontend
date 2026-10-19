"use client";

import { getMealSheet, saveDeposit, saveMealRecord, type MonthlySheet } from "@/actions/dashboard-actions";
import { DatePicker } from "@/components/shared/date-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserRole } from "@/interfaces/user-type";
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";

const numberValue = (value: string | number | null | undefined) => Number(value ?? 0);

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
    refresh().catch(() => setError("Could not load meal sheet"));
  }, []);

  async function saveRow(member: MonthlySheet["members"][number], values: { date: Date; type: "FULL" | "HALF"; amount: number; deposit: number }) {
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
    const depositResult = await saveDeposit({ messMemberId: member.id, amount: values.deposit });
    if (!depositResult.success) setError(depositResult.message || "Could not save deposit");
    else await refresh();
    setSaving(null);
  }

  if (error) return <Card><CardContent className="pt-6 text-destructive">{error}</CardContent></Card>;
  if (!sheet) return <Card><CardContent className="pt-6">Loading meal sheet...</CardContent></Card>;

  return <Card>
    <CardHeader><CardTitle>Meal sheet</CardTitle></CardHeader>
    <CardContent>{sheet.members.length === 0 ? <p className="text-muted-foreground">No members have joined this mess yet.</p> : <Table>
      <TableHeader><TableRow><TableHead>Member</TableHead><TableHead>Date</TableHead><TableHead>Meal type</TableHead><TableHead>Amount</TableHead><TableHead>Deposit</TableHead>{editable && <TableHead />}</TableRow></TableHeader>
      <TableBody>{sheet.members.map((member) => {
        const record = member.mealRecords[0];
        const initialDate = record?.mealDate ? parseISO(record.mealDate.slice(0, 10)) : undefined;
        const initialType = record?.mealType ?? "FULL";
        const initialAmount = numberValue(record?.mealRate ?? (initialType === "FULL" ? sheet.mealRate?.fullMealRate : sheet.mealRate?.halfMealRate));
        const initialDeposit = member.deposits.reduce((sum, deposit) => sum + numberValue(deposit.amount), 0);
        return <MealSheetRow key={member.id} member={member} editable={editable} saving={saving === member.id} initialDate={initialDate} initialType={initialType} initialAmount={initialAmount} initialDeposit={initialDeposit} rates={sheet.mealRate} onSave={saveRow} />;
      })}</TableBody>
    </Table>}</CardContent>
  </Card>;
}

function MealSheetRow({ member, editable, saving, initialDate, initialType, initialAmount, initialDeposit, rates, onSave }: {
  member: MonthlySheet["members"][number];
  editable: boolean;
  saving: boolean;
  initialDate?: Date;
  initialType: "FULL" | "HALF";
  initialAmount: number;
  initialDeposit: number;
  rates: MonthlySheet["mealRate"];
  onSave: (member: MonthlySheet["members"][number], values: { date: Date; type: "FULL" | "HALF"; amount: number; deposit: number }) => Promise<void>;
}) {
  const [date, setDate] = useState<Date | undefined>(initialDate);
  const [type, setType] = useState<"FULL" | "HALF">(initialType);
  const [amount, setAmount] = useState(String(initialAmount));
  const [deposit, setDeposit] = useState(String(initialDeposit));
  const selectedRate = type === "FULL" ? rates?.fullMealRate : rates?.halfMealRate;

  function changeType(value: "FULL" | "HALF") {
    setType(value);
    setAmount(String(numberValue(value === "FULL" ? rates?.fullMealRate : rates?.halfMealRate)));
  }

  return <TableRow>
    <TableCell><div className="font-medium">{member.user.name}</div><div className="text-xs text-muted-foreground">{member.user.phone}</div></TableCell>
    <TableCell>{editable ? <DatePicker date={date} onDateChange={setDate} disabled={saving} /> : date ? format(date, "PPP") : "Not set"}</TableCell>
    <TableCell>{editable ? <Select value={type} disabled={saving} onValueChange={(value) => changeType(value as "FULL" | "HALF")}><SelectTrigger className="w-24"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="FULL">Full</SelectItem><SelectItem value="HALF">Half</SelectItem></SelectContent></Select> : type}</TableCell>
    <TableCell>{editable ? <Input className="w-28" type="number" min="0" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder={String(selectedRate ?? "")} /> : numberValue(initialAmount).toFixed(2)}</TableCell>
    <TableCell>{editable ? <Input className="w-28" type="number" min="0" step="0.01" value={deposit} onChange={(event) => setDeposit(event.target.value)} /> : numberValue(initialDeposit).toFixed(2)}</TableCell>
    {editable && <TableCell><Button size="sm" disabled={saving || !date || Number(amount) < 0 || Number(deposit) < 0} onClick={() => date && onSave(member, { date, type, amount: Number(amount), deposit: Number(deposit) })}>{saving ? "Saving..." : "Save"}</Button></TableCell>}
  </TableRow>;
}
