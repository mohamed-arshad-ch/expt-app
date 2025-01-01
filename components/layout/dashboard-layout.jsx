import { Header } from "../header";
import { Sidebar } from "../sidebar";
import { SidebarToggle } from "../sidebar-toggle";


export default function DashboardLayout({
  children
}) {
  return (
    (<div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="md:ml-64">
        <Header />
        <SidebarToggle/>
        <main className="container mx-auto p-6 pt-16 md:pt-6">
          {children}
        </main>
      </div>
    </div>)
  );
}

