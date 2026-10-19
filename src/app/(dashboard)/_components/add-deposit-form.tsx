"use client";

import {
  getMealSheet,
  saveDeposit,
  type MonthlySheet,
} from "@/actions/dashboard-actions";
import { DatePicker } from "@/components/shared/date-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { useEffect, useState } from "react";

export function AddDepositForm() {
  const [members, setMembers] = useState<MonthlySheet["members"]>([]);
  const [memberId, setMemberId] = useState("");
  const [amount, setAmount] = useState("");
  const [depositDate, setDepositDate] = useState<Date | undefined>();
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadMembers() {
    try {
      const result = await getMealSheet();
      if (result.success && result.data) setMembers(result.data.members);
      else setMessage(result.message || "Could not load members");
    } catch {
      setMessage("Could not load members");
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDepositDate(new Date());
      void loadMembers();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const numericAmount = Number(amount);
    if (
      !memberId ||
      !depositDate ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      setMessage("Select a member, date, and enter a positive deposit amount.");
      return;
    }
    setSaving(true);
    setMessage(null);
    const result = await saveDeposit({
      messMemberId: memberId,
      amount: numericAmount,
      depositDate: format(depositDate, "yyyy-MM-dd"),
      note,
    });
    if (!result.success) {
      setMessage(result.message || "Could not save deposit");
    } else {
      setAmount("");
      setNote("");
      setDepositDate(new Date());
      setMessage("Deposit saved.");
      window.dispatchEvent(new CustomEvent("messmate:totals-refresh"));
      await loadMembers();
    }
    setSaving(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record deposit</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={submit}
          className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_1fr_auto]"
        >
          <Select
            value={memberId}
            onValueChange={(value) => setMemberId(value ?? "")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select member">
                {members.find((member) => member.id === memberId)?.user.name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {members.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DatePicker
            date={depositDate}
            onDateChange={setDepositDate}
            disabled={saving}
          />
          <Input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Amount"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
          <Input
            placeholder="Note (optional)"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
          <Button type="submit" disabled={saving || members.length === 0}>
            {saving ? "Saving..." : "Save deposit"}
          </Button>
        </form>
        {message && (
          <p className="mt-3 text-sm text-muted-foreground" role="status">
            {message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
