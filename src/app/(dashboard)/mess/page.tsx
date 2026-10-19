import { SectionCards } from "@/app/(dashboard)/_components/section-cards";
import { MealRateForm } from "@/app/(dashboard)/_components/meal-rate-form";
import { AddExpenseForm } from "./_components/add-expense-form";
import { AddDepositForm } from "../_components/add-deposit-form";

export default function MessDashboardPage() {
  return (
    <div className="flex flex-col gap-4 py-4 px-4 md:gap-6 md:py-6 md:px-6">
      <SectionCards />
      <MealRateForm />
      <AddDepositForm />
      <AddExpenseForm />
    </div>
  );
}
