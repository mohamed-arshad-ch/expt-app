
import DashboardScreen from "@/components/dashboard-screen";
import ExpenseListScreen from "@/components/expense-list-screen";
import DashboardLayout from "@/components/layout/dashboard-layout";




export default function Expenses() {
  return (
   <DashboardLayout>
    <ExpenseListScreen/>
   </DashboardLayout>
  );
}
