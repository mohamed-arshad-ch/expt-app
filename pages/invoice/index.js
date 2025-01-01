
import DashboardScreen from "@/components/dashboard-screen";
import InvoiceListScreen from "@/components/invoice-list-screen";
import DashboardLayout from "@/components/layout/dashboard-layout";




export default function Invoices() {
  return (
   <DashboardLayout>
    <InvoiceListScreen/>
   </DashboardLayout>
  );
}
