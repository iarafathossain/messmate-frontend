import { MonthlyMealSheet } from "@/app/(dashboard)/_components/monthly-meal-sheet";
import { UserRole } from "@/interfaces/user-type";

export default function MessMealSheetPage() {
  return <div className="p-4 md:p-6"><MonthlyMealSheet role={UserRole.MESS} /></div>;
}
