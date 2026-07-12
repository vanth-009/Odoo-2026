import Sidebar from "@/components/Sidebar";

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#09090b]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto ml-72 p-8 min-w-0">
        {children}
      </main>
    </div>
  );
}
