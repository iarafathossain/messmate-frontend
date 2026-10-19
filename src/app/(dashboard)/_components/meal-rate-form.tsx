"use client";

import { getMealSheet, saveMealRate } from "@/actions/dashboard-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

export function MealRateForm() {
  const [full, setFull] = useState("");
  const [half, setHalf] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMealSheet()
      .then((result) => {
        if (!result.success || !result.data?.mealRate) return;
        const rates = result.data.mealRate;
        setFull(rates.fullMealRate == null ? "" : String(rates.fullMealRate));
        setHalf(rates.halfMealRate == null ? "" : String(rates.halfMealRate));
      })
      .catch(() => setError("Could not load meal rates"));
  }, []);

  async function submit() {
    setError(null);
    setSaved(false);
    if (Number(full) < 0 || Number(half) < 0 || (!full && !half)) {
      setError("Enter at least one non-negative meal rate.");
      return;
    }
    setSaving(true);
    const result = await saveMealRate({
      fullMealRate: full ? Number(full) : undefined,
      halfMealRate: half ? Number(half) : undefined,
    });
    if (result.success) setSaved(true);
    else setError(result.message || "Could not save meal rate");
    setSaving(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meal rates</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap items-end gap-3">
        <label className="grid gap-1 text-sm">
          Full meal
          <Input
            type="number"
            min="0"
            step="0.01"
            value={full}
            onChange={(event) => setFull(event.target.value)}
          />
        </label>
        <label className="grid gap-1 text-sm">
          Half meal
          <Input
            type="number"
            min="0"
            step="0.01"
            value={half}
            onChange={(event) => setHalf(event.target.value)}
          />
        </label>
        <Button onClick={submit} disabled={saving}>
          {saving ? "Saving..." : "Save rates"}
        </Button>
        {saved && (
          <span className="text-sm text-emerald-600">Rates saved.</span>
        )}
        {error && (
          <span className="basis-full text-sm text-destructive">{error}</span>
        )}
      </CardContent>
    </Card>
  );
}
